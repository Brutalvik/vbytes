// store/countrySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CDN } from "@/lib/config"; // Assuming CDN is correctly configured

// --- Type Definitions ---
export interface CountryCodeItem {
  message: any;
  name: string;
  code: string; // ISO 3166-1 alpha-2 code (e.g., "US", "CA")
  dial_code: string; // e.g., "+1"
  flag: string; // e.g., "🇺🇸"
  // Add an 'id' if your data doesn't have a consistent one for Autocomplete keying
  // id?: string;
}

interface CountryState {
  // State for the full list of country codes
  list: CountryCodeItem[];
  listLoading: boolean;
  listError: string | null;

  // State for the automatically detected country code
  detectedCountry: CountryCodeItem | null; // Stores the full object of the detected country
  detecting: boolean; // Loading state for geolocation detection
  detectError: string | null;
}

const initialState: CountryState = {
  list: [],
  listLoading: false,
  listError: null,
  detectedCountry: null, // Initially no country detected
  detecting: false,
  detectError: null,
};

// --- API Endpoints ---
const GEO_LOCATION_API_URL: string = CDN.geoLocationUrl as string;
const COUNTRY_CODES_API_URL: string = CDN.countryCodesUrl as string;

// --- Async Thunks ---

export const fetchCountryCodes = createAsyncThunk<CountryCodeItem[], void, { rejectValue: string }>(
  "country/fetchCountryCodes",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(COUNTRY_CODES_API_URL);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch country codes: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const data: CountryCodeItem[] = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// //detect the user's geolocation
// export const detectUserGeolocation = createAsyncThunk<
//   CountryCodeItem,
//   void,
//   { rejectValue: string }
// >("country/detectUserGeolocation", async (_, thunkAPI) => {
//   try {
//     const response = await fetch(GEO_LOCATION_API_URL);
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(
//         `Failed to detect geolocation: ${response.status} ${response.statusText} - ${errorText}`
//       );
//     }
//     const data: CountryCodeItem = await response.json();
//     if (data.message && data.message.includes("Defaulting")) {
//       return data; // Returns the default +1 object
//     }
//     return data;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

// In countryCodesSlice.ts (or wherever detectUserGeolocation is)
export const detectUserGeolocation = createAsyncThunk(
  "countryCodes/detectUserGeolocation",
  async (_, { rejectWithValue }) => {
    console.log("Attempting to detect user geolocation...");
    try {
      // --- If using IP lookup API ---
      // Ensure this URL is correct for production
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        console.error("IP lookup API failed:", response.statusText);
        throw new Error("Failed to fetch IP geolocation");
      }
      const data = await response.json();
      console.log("IP Geolocation Data:", data); // IMPORTANT: Check this in Vercel browser console
      // Assuming 'data' has a 'country_code' or similar that you map to dial_code
      // You might need to transform this data to match your 'detectedUserGeoLocation' type
      return {
        message: data,
        name: data.country_name || "Unknown",
        code: data.country_code || "XX", // Default to 'XX' if not found
        dial_code: data.dial_code || "+0", // Default to '+0' if not found
        flag: data.country_flag || "🏳️", // Default to a placeholder flag if not foun
      } as CountryCodeItem; // Cast to your type

      // --- If using navigator.geolocation (client-side only) ---
      // return new Promise((resolve, reject) => {
      //   if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(
      //       (position) => {
      //         console.log('GPS Geolocation Position:', position.coords);
      //         // You'd then need to reverse geocode this lat/long to get a country code/dial code
      //         // This is more complex and usually requires another API call.
      //         // For initial auto-population, IP lookup is usually simpler.
      //         resolve(/* mapped geolocation data */);
      //       },
      //       (error) => {
      //         console.error('GPS Geolocation Error:', error);
      //         // Handle different error codes (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT)
      //         reject(error);
      //       }
      //     );
      //   } else {
      //     console.warn('Geolocation is not supported by this browser.');
      //     reject(new Error('Geolocation not supported'));
      //   }
      // });
    } catch (error) {
      console.error("Error detecting geolocation:", error); // VERY IMPORTANT
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// --- Country Slice ---
const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers for fetchCountryCodes
      .addCase(fetchCountryCodes.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchCountryCodes.fulfilled, (state, action: PayloadAction<CountryCodeItem[]>) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchCountryCodes.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.listLoading = false;
        state.listError = action.payload || "Failed to fetch country codes";
        state.list = [];
      })
      // Reducers for detectUserGeolocation
      .addCase(detectUserGeolocation.pending, (state) => {
        state.detecting = true;
        state.detectError = null;
      })
      .addCase(detectUserGeolocation.fulfilled, (state, action: PayloadAction<CountryCodeItem>) => {
        state.detecting = false;
        state.detectedCountry = action.payload;
      })
      .addCase(detectUserGeolocation.rejected, (state, action: PayloadAction<any>) => {
        state.detecting = false;
        state.detectError = action.payload || "Failed to detect geolocation";
        state.detectedCountry = null;
      });
  },
});

export default countrySlice.reducer;

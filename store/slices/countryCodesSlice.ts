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

//detect the user's geolocation
export const detectUserGeolocation = createAsyncThunk<
  CountryCodeItem,
  void,
  { rejectValue: string }
>("country/detectUserGeolocation", async (_, thunkAPI) => {
  try {
    const response = await fetch(GEO_LOCATION_API_URL);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to detect geolocation: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    const data: CountryCodeItem = await response.json();
    if (data.message && data.message.includes("Defaulting")) {
      return data; // Returns the default +1 object
    }
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

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
      .addCase(
        detectUserGeolocation.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.detecting = false;
          state.detectError = action.payload || "Failed to detect geolocation";
          state.detectedCountry = null;
        }
      );
  },
});

export default countrySlice.reducer;

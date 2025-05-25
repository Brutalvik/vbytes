// store/countrySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CDN } from "@/lib/config";
import { v4 as uuidv4 } from "uuid";

// --- Type Definitions ---
export interface CountryCodeItem {
  message?: any;
  data?: any;
  name: string;
  code: string; // ISO 3166-1 alpha-2 code (e.g., "US", "CA")
  dial_code: string; // e.g., "+1"
  flag: string;
  id: string;
}

interface CountryState {
  list: CountryCodeItem[];
  listLoading: boolean;
  listError: string | null;
  detectedCountry: CountryCodeItem | null;
  detecting: boolean;
  detectError: string | null;
}

const initialState: CountryState = {
  list: [],
  listLoading: false,
  listError: null,
  detectedCountry: null, // This will hold the detected country code
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

// --- If using IP lookup API ---
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
      console.log("IP Geolocation Data:", data);
      return {
        id: uuidv4(), // Generate a unique ID for the detected country
        data: data,
        name: data.country_name,
        code: data.country,
        dial_code: data.country_calling_code,
      } as CountryCodeItem;
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

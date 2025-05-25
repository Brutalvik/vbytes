// store/countrySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CDN } from "@/lib/config";
import { v4 as uuidv4 } from "uuid";

// --- Type Definitions ---
export interface CountryCodeItem {
  message?: any;
  data?: any;
  name: string;
  code: string;
  dial_code: string;
  flag: string;
  id: string;
}

interface CountryState {
  list: CountryCodeItem[];
  listLoading: boolean;
  listError: string | null;
}

const initialState: CountryState = {
  list: [],
  listLoading: false,
  listError: null,
};

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

// --- Country Slice ---
const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default countrySlice.reducer;

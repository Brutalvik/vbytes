// store/languageSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CDN } from "@/lib/config";

interface LanguageState {
  data: any[]; // Replace with more specific types if needed
  loading: boolean;
  error: string | null;
}

const initialState: LanguageState = {
  data: [],
  loading: false,
  error: null,
};

// Update this to your actual API endpoint
const API_URL: string = CDN.countryCodesUrl as string;

// Async thunk to fetch the country codes
export const fetchCountryCodes = createAsyncThunk(
  "languages/fetchCountryCodes",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch country codes");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const countryCodes = createSlice({
  name: "countryCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCountryCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default countryCodes.reducer;

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
const API_URL: string = CDN.languagesUrl as string;

// Async thunk to fetch the languages
export const fetchLanguages = createAsyncThunk(
  "languages/fetchLanguages",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch languages");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const languageSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default languageSlice.reducer;

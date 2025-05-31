// store/languageSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLanguages } from "@store/thunks/fetchLanguages";

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

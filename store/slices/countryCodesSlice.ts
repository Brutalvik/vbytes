// store/slices/countryCodesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchCountryCodes } from "../thunks/fetchCountryCodes";

export interface Country {
  id: string;
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export interface CountryCodesState {
  data: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryCodesState = {
  data: [],
  loading: false,
  error: null,
};

const countryCodesSlice = createSlice({
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

export default countryCodesSlice.reducer;

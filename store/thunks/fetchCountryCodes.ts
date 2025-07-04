import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCountryCodes = createAsyncThunk("countryCodes/fetch", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/dataset/countrycodes.json");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || "Failed to load country codes");
  }
});

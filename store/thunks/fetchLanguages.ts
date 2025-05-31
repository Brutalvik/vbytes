import { CDN } from "@/lib/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL: string = CDN.languagesUrl as string;


export const fetchLanguages = createAsyncThunk("languages/fetchLanguages", async (_, thunkAPI) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch languages");
    const data = await response.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

interface VerifyArgs {
  token: string;
}

export const verifyRecaptcha = createAsyncThunk<RecaptchaResponse, VerifyArgs>(
  "recaptcha/verify",
  async ({ token }, thunkAPI) => {
    try {
      const res = await axios.post("/api/verify-recaptcha", { token });

      const data: RecaptchaResponse = res.data;

      if (!data.success) {
        return thunkAPI.rejectWithValue("reCAPTCHA verification failed.");
      }

      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message || "Unknown error during verification.");
    }
  }
);

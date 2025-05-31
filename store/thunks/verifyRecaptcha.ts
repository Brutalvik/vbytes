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
        console.log("reached query")
      const res = await axios.post("/api/verify-recaptcha", { token });


      const data: RecaptchaResponse = res.data;

      if (!data.success) {
        return thunkAPI.rejectWithValue("reCAPTCHA verification failed.");
      }

      return data;
    } catch (err: any) {
        console.log("ERROR FROM THUNK: ", err?.response?.data || err.message);
      return thunkAPI.rejectWithValue(err?.message || "Unknown error during verification.");
    }
  }
);

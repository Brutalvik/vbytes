// app/api/verify-recaptcha/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import { CDN } from "@/lib/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token;
    const secret = CDN.googleRecaptchaSecretKey;

    if (!token || !secret) {
      return NextResponse.json(
        { success: false, "error-codes": ["missing-input-secret-or-token"] },
        { status: 400 }
      );
    }

    const response = await axios.post(
      CDN.googleRecaptchaVerifyURL as string,
      new URLSearchParams({
        secret,
        response: token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error?.response?.data || error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

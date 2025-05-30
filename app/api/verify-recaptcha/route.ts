// app/api/verify-recaptcha/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import { CDN } from "@/lib/config";

export async function POST(req: Request) {
  try {
    const reqQuery = await req;
    console.log("REQEUST QUERY : ", reqQuery)
    const secret = CDN.googleRecaptchaSiteKey; 

    // if (!token || !secret) {
    //   return NextResponse.json(
    //     { success: false, "error-codes": ["missing-input-secret"] },
    //     { status: 400 }
    //   );
    // }

    const response = await axios({
      method: "post",
      url: CDN.googeleRecaptchaVerify,
      params: {
        secret,
        response: token,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error?.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

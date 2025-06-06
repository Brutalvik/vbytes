import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { CDN } from "@/lib/config"; 

export async function GET() {
  console.log("vercel hit the api");
  try {
    console.log("entered api");
    const response = await axios.get(
      "https://lpkeoq39v7.execute-api.us-east-2.amazonaws.com/countries?file=country_code.json"
    );
    console.log("RESPONSE : ", response);
    const countries = response.data;
    const countriesWithIds = countries.map((country: any) => ({
      ...country,
      id: uuidv4(),
    }));

    return NextResponse.json(countriesWithIds, { status: 200 });
  } catch (error: any) {
    console.log("failed api");
    console.error("Error fetching country codes:", error?.response?.data || error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

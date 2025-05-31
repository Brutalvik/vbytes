import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { CDN } from "@/lib/config"; 

export async function GET() {
  try {
    const response = await axios.get(CDN.countryCodesUrl as string);
    const countries = response.data;

    const countriesWithIds = countries.map((country: any) => ({
      ...country,
      id: uuidv4(),
    }));

    return NextResponse.json(countriesWithIds, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching country codes:", error?.response?.data || error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

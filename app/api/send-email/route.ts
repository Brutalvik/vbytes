// /src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailHtml } from "@lib/generateEmailHtml";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const html = generateEmailHtml(body);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use AWS SES, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Vikram Kumar" <${process.env.EMAIL_USER}>`,
      to: body.email, // or to yourself for now
      subject: "Thanks for reaching out!",
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}

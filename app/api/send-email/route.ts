// /src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { transporter } from "@config/mail-config";
import { generateEmailHtml } from "@lib/generateEmailHtml";
import { generateCoverLetterHtml } from "@/lib/generateCoverLetterHtml";
import { fetchResume } from "./fetch-resume";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const html = generateEmailHtml({ name, email, message });
    // Generate HTML cover letter
    const coverLetterHtml = generateCoverLetterHtml(name);
    const buffer = await fetchResume();

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Let's Talk Message from ${name}`,
      html,
    };

    const confirmationMailOptionsWithAttachment = {
      from: `"Vikram Kumar" <no-reply@v-bytes.cloud>`,
      to: email,
      subject: `Thanks, ${name}! Here's my CV.`,
      html: coverLetterHtml,
      replyTo: process.env.SELF_EMAIL,
      attachments: [
        {
          filename: "Vikram_Kumar_CV.pdf",
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    };

    const confirmationMailOptions = {
      from: `"Vikram Kumar" <no-reply@v-bytes.cloud>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html,
      replyTo: process.env.SELF_EMAIL,
    };

    // ✅ 1. Send to yourself
    await transporter.sendMail(mailOptions);

    // ✅ 2. Send confirmation to user (masked sender)
    await transporter.sendMail(
      buffer ? confirmationMailOptionsWithAttachment : confirmationMailOptions
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}

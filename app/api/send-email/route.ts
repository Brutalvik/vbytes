import { NextResponse } from "next/server";
import { transporter } from "@config/mail-config";
import { generateEmailHtml } from "@lib/generateEmailHtml";
import { generateCoverLetterHtml } from "@/lib/generateCoverLetterHtml";
import { fetchResume } from "./fetch-resume";
import { startCase, toLower } from "lodash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    const capitalizedName = startCase(toLower(name));

    const html = generateEmailHtml({ name: capitalizedName, email, message });
    // Generate HTML cover letter
    const coverLetterHtml = generateCoverLetterHtml(name);

    let buffer: Buffer | null = null;
    try {
      buffer = await fetchResume();
    } catch (resumeError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch resume." },
        { status: 500 },
      );
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Let's Talk Message from ${capitalizedName}`,
      html,
    };

    const confirmationMailOptionsWithAttachment = {
      from: `"Vikram Kumar" <no-reply@v-bytes.cloud>`,
      to: email,
      subject: `Thanks, ${capitalizedName}! Here's my CV.`,
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
      subject: `Thanks for reaching out, ${capitalizedName}!`,
      html,
      replyTo: process.env.SELF_EMAIL,
    };

    // ✅ 1. Send to yourself
    await transporter.sendMail(mailOptions);

    // ✅ 2. Send confirmation to user (masked sender)
    await transporter.sendMail(
      buffer ? confirmationMailOptionsWithAttachment : confirmationMailOptions,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 },
    );
  }
}

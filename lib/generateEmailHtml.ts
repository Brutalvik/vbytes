import { EmailFormValues } from "@/types";

export function generateEmailHtml({
  name,
  phone,
  email,
  message,
  dialCode,
}: EmailFormValues): string {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 40px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(90deg, #0f172a, #1e293b); color: white; padding: 24px 32px;">
        <h2 style="margin: 0; font-size: 1.8rem;">Message from ${name}!</h2>
        <p style="margin: 4px 0 0; font-size: 1rem;">${name} wants to connect</p>
      </div>

      <div style="padding: 32px;">
        <p style="margin: 0; font-size: 1rem; color: #666;">You have received a new message from:</p>
        <p style="margin: 4px 0 0; font-weight: bold; font-size: 1.2rem;">${name}</p>
        <p style="margin: 4px 0 0; font-size: 1rem; color: #666;">Email: <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
        <p style="margin: 4px 0 0; font-size: 1rem; color: #666;">Phone: <a href="tel:${dialCode + phone}" style="color: #6366f1;"><strong>${dialCode} - ${phone}</strong></a></p>
        <h3 style="margin-bottom: 12px; color: #0f172a;">Message from ${name}</h3>
        <div style="
          background: #f9fafb;
          padding: 16px 20px;
          border-left: 4px solid #6366f1;
          border-radius: 6px;
          font-size: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
        ">
          ${message}
        </div>

        <p style="margin-top: 40px; font-size: 0.9rem; color: #666;">Best regards,</p>
        <p style="margin: 4px 0 0; font-weight: bold; font-size: 1rem;">${name}</p>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 0.85rem; color: #888;">
        This is an automated email confirmation from V-Bytes. Please do not reply to this email.
        <br>
        <a href="https://v-bytes.vercel.app" style="color: #6366f1; text-decoration: none;">v-bytes</a>
      </div>
    </div>
  </div>
  `;
}

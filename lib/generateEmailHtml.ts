import { EmailFormValues } from "@/types";

export function generateEmailHtml({
  name,
  countryCode,
  phone,
  email,
  message,
}: EmailFormValues): string {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 40px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(90deg, #0f172a, #1e293b); color: white; padding: 24px 32px;">
        <p style="margin: 0; font-size: 1rem; color: #666;">You have received a new message from:</p>
        <p style="margin: 4px 0 0; font-weight: bold; font-size: 1.2rem;">${name}</p>
        <p style="margin: 4px 0 0; font-size: 1rem; color: #666;">Email: <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
        <p style="margin: 4px 0 0; font-size: 1rem; color: #666;">Phone: <a href="tel:${countryCode}${phone}" style="color: #6366f1;"><strong>${countryCode}-${phone}</strong></a></p>
        <h3 style="margin-bottom: 12px; color: #0f172a;">Message from ${name}</h3>
        </div>

      <div style="padding: 32px;">
        <h3 style="margin-bottom: 12px; color: #0f172a;">Your Message</h3>
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
        <p style="margin: 4px 0 0; font-weight: bold; font-size: 1rem;">Vikram Kumar</p>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 0.85rem; color: #888;">
        This is an automated email confirmation. If you didn't submit this, feel free to ignore.
        <br/>
          <a href="https://v-bytes.cloud" style="color: #6366f1; text-decoration: none;">v-bytes</a>
      </div>
    </div>
  </div>
  `;
}

import { CDN } from "@/lib/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: CDN.emailService, // or use AWS SES, SendGrid, etc.
  auth: {
    user: CDN.selfEmail,
    pass: CDN.emailPassword,
  },
});

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // or use AWS SES, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// export const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },

// });

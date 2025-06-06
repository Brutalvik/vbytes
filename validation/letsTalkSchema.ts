// validation/letsTalkSchema.ts
import * as Yup from "yup";

export const letsTalkSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
  token: Yup.string().required("Recaptcha token is required"),
});

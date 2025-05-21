// validation/letsTalkSchema.ts
import * as Yup from "yup";

export const letsTalkSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9\-\+]{9,15}$/, "Invalid phone number")
    .required("Phone is required"),
  message: Yup.string().required("Message is required"),
});
export type LetsTalkFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};
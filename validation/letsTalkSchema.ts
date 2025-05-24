// validation/letsTalkSchema.ts
import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const letsTalkSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  message: Yup.string().required("Message is required"),
});

export type LetsTalkFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

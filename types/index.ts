import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface LanguageState {
  selectedLanguage: string;
  supportedLanguages: string[];
}

export type Language = {
  code: string;
  name: string;
};

export interface EmailFormValues {
  name: string;
  email: string;
  message: string;
}
export interface EmailFormProps {
  formik: {
    values: EmailFormValues;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    touched: { [key: string]: boolean };
    errors: { [key: string]: string };
  };
}

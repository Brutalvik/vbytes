import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface LanguageState {
  selectedLanguage: string;
  supportedLanguages: string[];
}



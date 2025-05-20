import { RootState } from "@store/store";

export const selectSelectedLanguage = (state: RootState & { language: { selectedLanguage: string } }) =>
  state.language.selectedLanguage;

export const selectSupportedLanguages = (state: RootState & { language: { supportedLanguages: string[] } }) =>
  state.language.supportedLanguages;
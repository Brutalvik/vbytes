import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageState } from "@/types";

// Ideally imported from an i18n/lib or API
import isoLanguages from "iso-639-1"; // NPM module for all ISO languages

const supportedLanguages = isoLanguages.getAllNames();

const initialState: LanguageState = {
  selectedLanguage: "English",
  supportedLanguages,
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      if (state.supportedLanguages.includes(action.payload)) {
        state.selectedLanguage = action.payload;
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
export const selectLanguage = (state: { language: LanguageState }) =>
  state.language.selectedLanguage;

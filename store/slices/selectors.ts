import { RootState } from "@store/store";


//selectors for language slice
export const selectSelectedLanguage = (
  state: RootState & { language: { selectedLanguage: string } }
) => state.language.selectedLanguage;

export const selectSupportedLanguages = (
  state: RootState & { language: { supportedLanguages: string[] } }
) => state.language.supportedLanguages;

export const selectLanguages = (
  state: RootState & { language: { data: any[] } }
) => state.language.data;

export const selectLoading = (
  state: RootState & { language: { loading: boolean } }
) => state.language.loading;
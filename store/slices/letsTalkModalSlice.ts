// store/slices/letsTalkModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LetsTalkFormData {
  name: string;
  email: string;
  message: string;
}

interface LetsTalkModalState {
  isOpen: boolean;
  form: LetsTalkFormData;
}

const initialState: LetsTalkModalState = {
  isOpen: false,
  form: {
    name: "",
    email: "",
    message: "",
  },
};

export const letsTalkModalSlice = createSlice({
  name: "letsTalkModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    updateForm: (state, action: PayloadAction<Partial<LetsTalkFormData>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = initialState.form;
    },
  },
});

export const { openModal, closeModal, updateForm, resetForm } = letsTalkModalSlice.actions;

export default letsTalkModalSlice.reducer;

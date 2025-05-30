"use client";

import React, { useState } from "react";
import { FormikProps } from "formik";
import { EmailFormValues } from "@/types";
import { Button } from "@heroui/button";
import { ModalFooter } from "@components/ui/animated-modal";
import { AnimatePresence, motion } from "framer-motion";
import { Input, Textarea } from "@heroui/input";

const steps = ["intro", "name", "phone", "email", "message"];

const InteractiveFormContent = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const [formStep, setFormStep] = useState(0);

  const isStepValid = () => {
    const fields = ["name", "phone", "email", "message"];
    const currentField = fields[formStep - 1];
    return (
      formStep === 0 ||
      (!formik.errors[currentField as keyof EmailFormValues] &&
        formik.values[currentField as keyof EmailFormValues])
    );
  };

  const nextStep = () => {
    if (formStep < steps.length - 1 && isStepValid()) {
      setFormStep((prev) => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[formStep]) {
      case "intro":
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-xl font-semibold">Let's start a conversation 🤝</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              This is an interactive form. We'll take it one step at a time.
            </p>
          </motion.div>
        );

      case "name":
        return (
          <FormField
            key="name"
            label="Hey there 👋 What should I call you?"
            id="name"
            type="text"
            value={formik.values.name || ""}
            errorMessage={formik.errors.name}
            isInvalid={formik.touched.name}
            placeholder="e.g. John Smith"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        );

      case "phone":
        return (
          <FormField
            key="phone"
            label="let"
            id="phone"
            type="text"
            value={formik.values.phone || ""}
            errorMessage={formik.errors.phone}
            isInvalid={formik.touched.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        );

      case "email":
        return (
          <FormField
            key="email"
            label="Email"
            id="email"
            type="email"
            value={formik.values.email || ""}
            errorMessage={formik.errors.email}
            isInvalid={formik.touched.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        );

      case "message":
        return (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor="message"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Message
            </label>
            <Textarea
              id="message"
              rows={4}
              value={formik.values.message || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Type your message here..."
              isInvalid={formik.touched.message}
              errorMessage={formik.touched.message && formik.errors.message}
              className="w-full mt-1 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto mb-10">
      <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

      <ModalFooter className="justify-center">
        <Button
          type={formStep === steps.length - 1 ? "submit" : "button"}
          onPress={formStep === steps.length - 1 ? undefined : nextStep}
          className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105"
          isDisabled={!isStepValid()}
        >
          {formStep === 0 ? "Start" : formStep === steps.length - 1 ? "Send" : "Continue"}
        </Button>
      </ModalFooter>
    </div>
  );
};

const FormField = ({
  label,
  id,
  type,
  value,
  errorMessage,
  isInvalid,
  placeholder,
  onChange,
  onBlur,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
}) => (
  <motion.div
    key={id}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.5 }}
  >
    <label
      htmlFor={id}
      className="block text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-4"
    >
      {label}
    </label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      placeholder={placeholder}
      variant="bordered"
    />
  </motion.div>
);

const InteractiveEmailForm: React.FC<{ formik: FormikProps<EmailFormValues> }> = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <InteractiveFormContent formik={formik} />
    </form>
  );
};

export default InteractiveEmailForm;

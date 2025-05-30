"use client";

import React, { useState } from "react";
import { FormikProps } from "formik";
import { EmailFormValues } from "@/types";
import { Button } from "@heroui/button";
import { ModalFooter } from "@components/ui/animated-modal";
import { AnimatePresence, motion } from "framer-motion";
import Recaptcha from "@/components/ui/recaptcha";
import { Input, Textarea } from "@heroui/input";

// Conversational form steps
const steps = ["intro", "name", "phone", "email", "message", "recaptcha"];

const InteractiveFormContent = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const [formStep, setFormStep] = useState(0);
  const [microFeedback, setMicroFeedback] = useState<string | null>(null);

  const fields: (keyof EmailFormValues)[] = ["name", "phone", "email", "message", "token"];
  const currentField = fields[formStep - 1];

  const isStepValid = () =>
    formStep === 0 || (!formik.errors[currentField] && formik.values[currentField]);

  const nextStep = () => {
    const value = formik.values[currentField];

    if (formStep === 0) {
      setFormStep(1);
      return;
    }

    if (!formik.errors[currentField] && formik.values[currentField]) {
      const feedbackMap: Record<string, string> = {
        name: `Nice to meet you, ${value}!`,
        phone: `Got your number 📞`,
        email: `Perfect. I’ll be in touch at ${value}`,
        message: `Thanks for sharing your thoughts 💬`,
        token: `Thanks for confirming you're human 🤖`,
      };

      setMicroFeedback(feedbackMap[currentField]);

      setTimeout(() => {
        setMicroFeedback(null);
        setFormStep((prev) => prev + 1);
      }, 1500);
    } else {
      formik.setFieldTouched(currentField, true, true);
    }
  };

  const getRecaptcha = (token: string) => {
    formik.setFieldValue("token", token || "");
    formik.setFieldTouched("token", true, true);
  };

  const renderStepContent = () => {
    if (microFeedback) {
      return (
        <motion.div
          key="microFeedback"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="text-center text-green-500 text-base font-semibold"
        >
          {microFeedback}
        </motion.div>
      );
    }

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
      case "phone":
      case "email": {
        const id = steps[formStep] as keyof EmailFormValues;
        return (
          <FormField
            key={id}
            id={id}
            type={id === "email" ? "email" : "text"}
            label={
              id === "name"
                ? "Hey there 👋 What should I call you?"
                : id === "phone"
                  ? "And if I need to reach you, what's your number?"
                  : "Where can I send a reply? Your email works great."
            }
            value={formik.values[id]}
            errorMessage={formik.errors[id] || ""}
            isInvalid={!!(formik.touched[id] && formik.errors[id])}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        );
      }

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
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              What would you like to tell me? I’m listening 📝
            </label>
            <Textarea
              id="message"
              rows={4}
              minRows={4}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.message && formik.errors.message)}
              errorMessage={
                formik.touched.message && formik.errors.message ? formik.errors.message : ""
              }
              placeholder="Type your message here..."
              variant="bordered"
            />
          </motion.div>
        );

      case "recaptcha":
        return (
          <motion.div
            key="recaptcha"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
              Just one more thing... can you confirm you're human? 🤖
            </p>
            <div className="mx-auto flex justify-center items-center">
              <div className="rounded-lg p-3 border border-neutral-300 dark:border-neutral-600 shadow-lg bg-white dark:bg-neutral-800">
                <Recaptcha onChange={(token) => getRecaptcha(token as string)} />
              </div>
            </div>
            {formik.touched.token && formik.errors.token && (
              <div className="text-red-500 text-sm mt-1 text-center">{formik.errors.token}</div>
            )}
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
  isInvalid,
  errorMessage,
  onChange,
  onBlur,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  isInvalid: boolean;
  errorMessage: string;
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
      errorMessage={isInvalid ? errorMessage : ""}
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

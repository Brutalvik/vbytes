"use client";

import React, { useState } from "react";
import { FormikProps } from "formik";
import { EmailFormValues } from "@/types";
import { Button } from "@heroui/button";
import { ModalFooter } from "@components/ui/animated-modal";
import { AnimatePresence, motion } from "framer-motion";
import Recaptcha from "@/components/ui/recaptcha";
import { Input, Textarea } from "@heroui/input";

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
        name: `Nice to meet you, ${value}! 👋`,
        phone: `Thanks! Got your number 📱`,
        email: `Perfect — I'll follow up at ${value} ✉️`,
        message: `Appreciate you sharing that 💬`,
        token: `reCAPTCHA complete — you're all set! ✅`,
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
          role="status"
          aria-live="polite"
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
              I’ll guide you through step by step — ready when you are.
            </p>
          </motion.div>
        );

      case "name":
        return (
          <FormField
            id="name"
            type="text"
            label="Let's get started — what's your full name? 👤"
            value={formik.values.name}
            errorMessage={formik.errors.name || ""}
            isInvalid={!!(formik.touched.name && formik.errors.name)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorId="name-error"
          />
        );

      case "phone":
        return (
          <FormField
            id="phone"
            type="text"
            label="What's the best number to reach you at? 📞"
            value={formik.values.phone}
            errorMessage={formik.errors.phone || ""}
            isInvalid={!!(formik.touched.phone && formik.errors.phone)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorId="phone-error"
          />
        );

      case "email":
        return (
          <FormField
            id="email"
            type="email"
            label="Where can we follow up via email? 📧"
            value={formik.values.email}
            errorMessage={formik.errors.email || ""}
            isInvalid={!!(formik.touched.email && formik.errors.email)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorId="email-error"
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
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              What would you like to discuss? Feel free to share. 📝
            </label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              minRows={4}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.message && formik.errors.message)}
              errorMessage={
                formik.touched.message && formik.errors.message ? formik.errors.message : ""
              }
              placeholder="Type your message here... (Shift+Enter for a new line)"
              variant="bordered"
              aria-invalid={!!(formik.touched.message && formik.errors.message)}
              aria-describedby="message-error"
            />
            {formik.touched.message && formik.errors.message && (
              <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">
                {formik.errors.message}
              </p>
            )}
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
              Almost done — just confirm you're not a robot 🤖
            </p>
            <div className="mx-auto flex justify-center items-center">
              <div
                className="rounded-lg p-3 border border-neutral-300 dark:border-neutral-600 shadow-lg bg-white dark:bg-neutral-800"
                aria-label="reCAPTCHA security check"
              >
                <Recaptcha onChange={(token) => getRecaptcha(token as string)} />
              </div>
            </div>
            {formik.touched.token && formik.errors.token && (
              <p id="token-error" className="text-red-500 text-sm mt-1 text-center" role="alert">
                {formik.errors.token}
              </p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="space-y-6 max-w-sm mx-auto mb-10"
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          !e.shiftKey &&
          formStep > 0 &&
          formStep < steps.length - 1 &&
          (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) &&
          isStepValid()
        ) {
          e.preventDefault();
          nextStep();
        }
      }}
    >
      <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

      {!microFeedback && (
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
      )}
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
  errorId,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  isInvalid: boolean;
  errorMessage: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  errorId: string;
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
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={isInvalid ? errorMessage : ""}
      variant="bordered"
      aria-invalid={isInvalid}
      aria-describedby={isInvalid ? errorId : undefined}
    />
    {isInvalid && (
      <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
        {errorMessage}
      </p>
    )}
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

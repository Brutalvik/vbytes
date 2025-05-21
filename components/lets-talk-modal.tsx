"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@components/ui/animated-modal";
import styles from "@styles/lets-talk-button.module.css";
import { useFormik } from "formik";
import { letsTalkSchema } from "@/validation/letsTalkSchema";
import { Button } from "@heroui/button";
import EmailLoader from "@components/ui/email-loader";
import { FormikProps } from "formik";

interface EmailFormValues {
  name: string;
  email: string;
  message: string;
}

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-4 max-w-sm mx-auto mb-10">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Type your message here..."
            className="w-full mt-1 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
          {formik.touched.message && formik.errors.message && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.message}
            </div>
          )}
        </div>
      </div>

      <ModalFooter className="gap-4">
        <Button
          type="submit"
          className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105"
        >
          Send
        </Button>
      </ModalFooter>
    </form>
  );
};

export function LetsTalkModal() {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const initialValues = React.useMemo(
    () => ({
      name: "",
      email: "",
      message: "",
    }),
    []
  );

  const formik = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: letsTalkSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // ✅ Use the values passed in
        });

        const result = await response.json();

        if (result.success) {
          setEmailSent(true);
          resetForm(); // ✅ use resetForm from Formik helpers
        } else {
          alert("Failed to send email. Please try again.");
        }
      } catch (err) {
        console.error("Email send error:", err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
        setTimeout(() => setEmailSent(false), 4000);
      }
    },
  });

  return (
    <div className="py-40 flex items-center justify-center">
      <Modal>
        <ModalTrigger
          className={`bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${styles.button}`}
        >
          <div className={styles.waveOverlay}></div>
          <span className={styles.text}>Let's Talk</span>
        </ModalTrigger>

        <ModalBody onClose={() => formik.resetForm()}>
          <ModalContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <EmailLoader />
              </div>
            ) : emailSent ? (
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                Email Sent!
                <br />
                <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                  Thank you for reaching out!
                </span>
              </h4>
            ) : (
              <>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Let's
                  <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                    Talk
                  </span>
                </h4>
                <EmailForm formik={formik} />
              </>
            )}
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}

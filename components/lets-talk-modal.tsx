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
import EmailLoader from "@components/ui/email-loader";
import EmailForm from "@components/email-form";




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

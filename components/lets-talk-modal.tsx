"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@components/ui/animated-modal";
import styles from "@styles/lets-talk-button.module.css";
import { useFormik } from "formik";
import { letsTalkSchema } from "@/validation/letsTalkSchema";
import EmailLoader from "@components/ui/email-loader";
import EmailForm from "@components/email-form";
import EmailSentMessage from "@components/email-sent-message";
import EmailMessageWithAttachment from "@components/email-sent-message-with-attachment";
import { fetchResume } from "@/app/api/send-email/fetch-resume";
import { startCase, toLower } from "lodash";
import { EmailFormValues } from "@/types";

export function LetsTalkModal() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [name, setName] = useState("");
  const [buffer, setBuffer] = useState<Buffer | null>(null);
  const [bufferError, setBufferError] = useState(false);

  const initialValues: EmailFormValues = useMemo(
    () => ({
      name: "",
      dialCode: "",
      countryCode: "",
      phone: "",
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
      setSubmittedEmail(values.email);
      setName(startCase(toLower(values.name)));

      try {
        const resume = await fetchResume();
        setBuffer(resume);
        setBufferError(false);
      } catch (err) {
        console.error("Failed to fetch resume:", err);
        setBufferError(true);
      }

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        await response.json();
        setEmailSent(true);
        resetForm();
      } catch (err) {
        console.error("Email send error:", err);
        setEmailSent(true);
        resetForm();
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger
          className={`bg-black dark:bg-white dark:text-black text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${styles.button}`}
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
              buffer && !bufferError ? (
                <EmailMessageWithAttachment
                  email={submittedEmail}
                  name={name}
                  onModalClose={() => {
                    setEmailSent(false);
                    formik.resetForm();
                  }}
                />
              ) : (
                <EmailSentMessage
                  email={submittedEmail}
                  name={name}
                  onModalClose={() => {
                    setEmailSent(false);
                    formik.resetForm();
                  }}
                />
              )
            ) : (
              <>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Let&apos;s
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

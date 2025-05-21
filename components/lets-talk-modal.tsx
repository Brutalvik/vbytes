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

export function LetsTalkModal() {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: letsTalkSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Form Submitted:", values);
      alert("Form submitted successfully!");
      resetForm();
      // TODO: hook this to email sending or API
    },
  });

  const handleSuccess = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setEmailSent(true); // <- only after loading is done
      formik.resetForm();

      // Reset back to form after showing success message for 4s
      setTimeout(() => {
        setEmailSent(false);
      }, 4000);
    }, 3000); // Simulated email send time
  };

  const EmailForm = () => {
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
              {...formik.getFieldProps("name")}
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
              {...formik.getFieldProps("email")}
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
              {...formik.getFieldProps("message")}
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
            onPress={handleSuccess}
          >
            Send
          </Button>
        </ModalFooter>
      </form>
    );
  };

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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <EmailLoader />
            </div>
          ) : emailSent ? (
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                Email Sent!
                <br />
                <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                  Thank you for reaching out!
                </span>
              </h4>
            </ModalContent>
          ) : (
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                Let's
                <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                  Talk
                </span>
              </h4>
              <EmailForm />
            </ModalContent>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

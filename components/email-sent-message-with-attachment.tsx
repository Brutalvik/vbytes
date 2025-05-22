"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@components/ui/animated-modal";

interface EmailMessageWithAttachmentProps {
  email: string;
  name: string;
  onModalClose: () => void;
}

const EmailMessageWithAttachment: React.FC<EmailMessageWithAttachmentProps> = ({
  email,
  name,
  onModalClose,
}) => {
  const { setOpen } = useModal();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      setOpen(false); // Close the modal
      onModalClose(); // Inform the parent to reset state
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [setOpen, onModalClose]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-6">
        Thank you {name}
      </h2>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-6">
        📄 Cover Letter & CV Sent!
      </h4>
      <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-300 max-w-md">
        I’ve sent an email with my cover letter and CV attached to
        <br />
        <span className="font-medium text-black dark:text-white">{email}</span>
      </p>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        This modal will auto-close in{" "}
        <span className="font-semibold">{timer}</span> seconds.
      </p>
    </div>
  );
};

export default EmailMessageWithAttachment;

"use client";

import React from "react";

const EmailSentMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-8">
        Email Sent!
        <br />
        <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
          Thank you for reaching out!
        </span>
      </h4>
    </div>
  );
};

export default EmailSentMessage;

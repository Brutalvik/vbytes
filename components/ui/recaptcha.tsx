"use client";

import { FC, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { isNull } from "lodash";
import { RecaptchaProps } from "@/types";
import { CDN } from "@/lib/config";

const Recaptcha: FC<RecaptchaProps> = ({ onChange, requestId }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    !isNull(recaptchaRef.current) && recaptchaRef.current.reset();
  }, [requestId]);

  return (
    <div className="flex justify-center items-center">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={CDN.googleRecaptchaSiteKey as string}
        onChange={onChange}
        size="normal"
        theme="dark"
      />
    </div>
  );
};

export default Recaptcha;

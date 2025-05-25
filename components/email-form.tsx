"use client";

import { EmailFormValues } from "@/types";
import { FormikProps } from "formik/dist/types";
import { ModalFooter } from "@components/ui/animated-modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import {
  selectCountryCodes,
  selectCountryCodesLoading,
  selecteDetectedGeoLocation,
} from "@/store/slices/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { detectUserGeolocation, fetchCountryCodes } from "@/store/slices/countryCodesSlice";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect } from "react";
import { Key } from "@react-types/shared";

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const dispatch = useAppDispatch();
  const countryCodes = useAppSelector(selectCountryCodes);
  const countryCodesLoading = useAppSelector(selectCountryCodesLoading);
  const detectedUserGeoLocation = useAppSelector(selecteDetectedGeoLocation);

  useEffect(() => {
    dispatch(fetchCountryCodes());
    dispatch(detectUserGeolocation());
  }, [dispatch]);

  useEffect(() => {
    if (detectedUserGeoLocation) {
      console.log("detectedUserGeoLocation in EmailForm:", detectedUserGeoLocation);
      if (!formik.values.countryCode) {
        console.log("countryCode not set, setting it now.");
        console.log("countryCodes:", countryCodes);
        console.log("formik.values.countryCode:", formik.values.countryCode);
        console.log("formik.values.dialCode:", formik.values.dialCode);
        console.log("detectedUserGeoLocation.dial_code:", detectedUserGeoLocation.dial_code);

        const detectedCountry = countryCodes.find(
          (country: { dial_code: any }) => country.dial_code === detectedUserGeoLocation.dial_code
        );
        if (detectedCountry) {
          console.log("Setting countryCode and dialCode via geolocation:", detectedCountry);
          formik.setFieldValue("countryCode", detectedCountry.code);
          formik.setFieldValue("dialCode", detectedCountry.dial_code);
        } else {
          console.warn(
            "Detected country not found in countryCodes:",
            detectedUserGeoLocation.dial_code
          );
        }
      } else {
        console.log(
          "countryCode already set by user or initial render:",
          formik.values.countryCode
        );
      }
    } else {
      console.log("detectedUserGeoLocation is null or undefined.");
    }
  }, [detectedUserGeoLocation, countryCodes, formik.setFieldValue, formik.values.countryCode]);

  useEffect(() => {
    if (detectedUserGeoLocation && !formik.values.countryCode) {
      const detectedCountry = countryCodes.find(
        (country: { dial_code: any }) => country.dial_code === detectedUserGeoLocation.dial_code
      );
      if (detectedCountry) {
        formik.setFieldValue("countryCode", detectedCountry.code);
        formik.setFieldValue("dialCode", detectedCountry.dial_code);
      }
    }
  }, [detectedUserGeoLocation, countryCodes, formik.setFieldValue]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-2 max-w-md mx-auto">
        <div>
          <Input
            label="Name"
            id="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.name && formik.errors.name)}
            errorMessage={formik.touched.name && formik.errors.name}
            variant="bordered"
          />
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <Autocomplete<{ dial_code: string; flag: string; code: string; name: string }>
              aria-hidden="false"
              id="countryCode"
              label="Country Code"
              isInvalid={!!(formik.touched.countryCode && formik.errors.countryCode)}
              errorMessage={formik.touched.countryCode && formik.errors.countryCode}
              className="w-full sm:w-1/2 mb-4 sm:mb-0"
              defaultItems={countryCodes}
              variant="bordered"
              aria-label="Country Code"
              isLoading={countryCodesLoading}
              selectedKey={formik.values.countryCode}
              value={formik.values.dialCode}
              isClearable={false}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  const selectedCountry = countryCodes.find(
                    (country: { code: Key | null }) => country.code === formik.values.countryCode
                  );
                  if (selectedCountry) {
                    formik.setFieldValue("countryCode", selectedCountry.code);
                    formik.setFieldValue("dialCode", selectedCountry.dial_code);
                  } else {
                    formik.setFieldValue("countryCode", "");
                    formik.setFieldValue("dialCode", "");
                  }
                }
              }}
              onSelectionChange={(key) => {
                const selectedCountry = countryCodes.find(
                  (country: { code: Key | null }) => country.code === key
                );
                if (selectedCountry) {
                  formik.setFieldValue("countryCode", selectedCountry.code);
                  formik.setFieldValue("dialCode", selectedCountry.dial_code);
                } else {
                  formik.setFieldValue("countryCode", "");
                  formik.setFieldValue("dialCode", "");
                }
              }}
              onBlur={() => formik.setFieldTouched("countryCode", true)}
              placeholder="Code"
            >
              {(item) => (
                <AutocompleteItem key={item.code} textValue={item.dial_code}>
                  <div className="flex items-center gap-2">
                    <span role="img" aria-label="flag">
                      {item.flag}
                    </span>
                    <span>{item.dial_code}</span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Input
              label="Phone"
              id="phone"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.phone && formik.errors.phone)}
              errorMessage={formik.touched.phone && formik.errors.phone}
              variant="bordered"
              placeholder="e.g. 123-456-7890"
            />
          </div>
        </div>

        <div>
          <Input
            label="Email"
            id="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.email && formik.errors.email)}
            errorMessage={formik.touched.email && formik.errors.email}
            variant="bordered"
          />
        </div>

        <div>
          <Textarea
            label="Message"
            id="message"
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Type your message here..."
            isInvalid={!!(formik.touched.message && formik.errors.message)}
            errorMessage={formik.touched.message && formik.errors.message}
            variant="bordered"
            className="resize-none"
            maxLength={500}
          />
        </div>
      </div>

      <ModalFooter className="gap-4 justify-center mt-6">
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

export default EmailForm;

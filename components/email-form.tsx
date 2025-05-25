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
import {
  CountryCodeItem,
  detectUserGeolocation,
  fetchCountryCodes,
} from "@/store/slices/countryCodesSlice";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";
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
    if (
      detectedUserGeoLocation &&
      !countryCodesLoading &&
      countryCodes.length > 0 &&
      !formik.values.countryCode
    ) {
      console.log("Auto-populating: All Redux data available and loaded.");
      console.log("detectedUserGeoLocation:", detectedUserGeoLocation);
      console.log("countryCodes (from Redux, now populated):", countryCodes);

      const detectedCountry = countryCodes.find(
        (country: { dial_code: any }) => country.dial_code === detectedUserGeoLocation.dial_code
      );

      if (detectedCountry) {
        console.log("Match found! Setting countryCode and dialCode:", detectedCountry);
        formik.setFieldValue("countryCode", detectedCountry.code);
        formik.setFieldValue("dialCode", detectedCountry.dial_code);
      } else {
        console.warn(
          "No matching country found for detected dial_code:",
          detectedUserGeoLocation.dial_code,
          "in loaded countryCodes."
        );
      }
    } else {
      console.log(
        "Auto-population skipped (waiting for Redux state):",
        "detectedUserGeoLocation:",
        !!detectedUserGeoLocation,
        "countryCodes loading:",
        countryCodesLoading,
        "countryCodes loaded:",
        countryCodes.length > 0,
        "formik.values.countryCode empty:",
        !formik.values.countryCode
      );
    }
  }, [
    detectedUserGeoLocation,
    countryCodes,
    countryCodesLoading,
    formik.setFieldValue,
    formik.values.countryCode,
  ]);

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
              // Removed aria-hidden="false" as it's not needed and can conflict with library's ARIA
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
              value={formik.values.dialCode} // Display the dialCode in the input
              isClearable={false}
              // Added a key prop for Autocomplete to ensure re-render when values change
              // This is a common pattern for controlled components from external libraries
              key={formik.values.countryCode || "initial"} // Use a stable key that changes when countryCode changes
              onKeyDown={(e) => {
                // This onKeyDown logic is for handling tab behavior if not automatically handled by Autocomplete
                // It ensures the formik values are correctly set even on tab, but Autocomplete should handle this itself
                if (e.key === "Tab" && !formik.values.countryCode) {
                  const selectedCountry = countryCodes.find(
                    (country: { code: Key | null }) => country.code === formik.values.countryCode
                  );
                  if (selectedCountry) {
                    formik.setFieldValue("countryCode", selectedCountry.code);
                    formik.setFieldValue("dialCode", selectedCountry.dial_code);
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
                  // If selection is cleared (e.g., by backspace), clear both fields
                  formik.setFieldValue("countryCode", "");
                  formik.setFieldValue("dialCode", "");
                }
              }}
              onBlur={() => {
                // Ensure formik.values.dialCode is correct on blur if the Autocomplete value is left unselected
                if (!formik.values.countryCode && formik.values.dialCode) {
                  formik.setFieldValue("dialCode", ""); // Clear dialCode if countryCode is empty
                }
                formik.setFieldTouched("countryCode", true);
              }}
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

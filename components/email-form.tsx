"use client";

import { EmailFormValues } from "@/types";
import { FormikProps } from "formik/dist/types";
import { ModalFooter } from "@components/ui/animated-modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { selectCountryCodes, selectCountryCodesLoading } from "@/store/slices/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountryCodes } from "@/store/slices/countryCodesSlice";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Key, useEffect } from "react";

interface CountryCodeItem {
  dial_code: string;
  flag: string;
  code: string;
  name: string;
}

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const dispatch = useAppDispatch();
  const countryCodes: CountryCodeItem[] = useAppSelector(selectCountryCodes);
  const countryCodesLoading = useAppSelector(selectCountryCodesLoading);

  useEffect(() => {
    dispatch(fetchCountryCodes());
  }, [dispatch]);

  useEffect(() => {
    if (!countryCodesLoading && countryCodes.length > 0 && !formik.values.countryCode) {
      const canada = countryCodes.find(
        (country) => country.code === "CA" && country.dial_code === "+1"
      );

      if (canada) {
        formik.setFieldValue("countryCode", canada.code);
        formik.setFieldValue("dialCode", canada.dial_code);
      }
    }
  }, [countryCodes, countryCodesLoading, formik.setFieldValue, formik.values.countryCode]);

  if (countryCodesLoading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading component
  }
  if (countryCodes.length === 0) {
    return <div>No country codes available.</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-2 max-w">
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
            className="mb-0"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex items-center w-full sm:w-1/2 gap-4">
            <span className="text-xl py-4">
              {/* Added mr-2 for spacing */}
              {(() => {
                const selected = countryCodes.find((c) => c.code === formik.values.countryCode);
                return selected ? `${selected.flag}` : "";
              })()}
            </span>
            <Autocomplete<CountryCodeItem>
              aria-labelledby="Country"
              id="countryCode"
              label="Country"
              isInvalid={!!(formik.touched.countryCode && formik.errors.countryCode)}
              errorMessage={formik.touched.countryCode && formik.errors.countryCode}
              className="w-full mt-1"
              defaultItems={countryCodes}
              variant="bordered"
              aria-label="Country Code"
              isLoading={countryCodesLoading}
              selectedKey={formik.values.countryCode}
              isClearable={false}
              key={formik.values.countryCode || "initial"}
              onInputChange={(e) => {
                countryCodes.filter((country) => {
                  return String(country.dial_code).includes(String(e));
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
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
                const selectedCountry = countryCodes.find((country) => country.code === key);
                if (selectedCountry) {
                  formik.setFieldValue("countryCode", selectedCountry.code);
                  formik.setFieldValue("dialCode", selectedCountry.dial_code);
                } else {
                  formik.setFieldValue("countryCode", "");
                  formik.setFieldValue("dialCode", "");
                }
              }}
              onBlur={() => {
                if (!formik.values.countryCode && formik.values.dialCode) {
                  formik.setFieldValue("dialCode", "");
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
          </div>

          {/* Phone Input - now responsive */}
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
            className="w-full mt-1"
          />
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

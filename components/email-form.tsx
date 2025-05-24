"use client";

import { EmailFormValues } from "@/types";
import { FormikProps } from "formik/dist/types";
import { ModalFooter } from "@components/ui/animated-modal";
import { Button } from "@heroui/button";
import {
  selectCountryCodes,
  selectCountryCodesLoading,
  selectCountryCodesError,
} from "@/store/slices/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountryCodes } from "@/store/slices/countryCodesSlice";
import { Autocomplete, AutocompleteItem, form } from "@heroui/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const dispatch = useAppDispatch();
  const countryCodes = useAppSelector(selectCountryCodes);
  const countryCodesLoading = useAppSelector(selectCountryCodesLoading);
  const countryCodesError = useAppSelector(selectCountryCodesError);

  useEffect(() => {
    dispatch(fetchCountryCodes());
  }, [dispatch]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-2 max-w-md mx-auto">
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
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Phone
          </label>

          {/* Container for side-by-side on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <Autocomplete<{ dial_code: string; flag: string; code: string; name: string }>
              allowsCustomValue
              className="w-full sm:w-1/2 mb-4 sm:mb-0"
              defaultItems={countryCodes}
              variant="bordered"
              aria-label="Country Code"
              isLoading={countryCodesLoading}
              value={formik.values.dialCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Code"
            >
              {(item) => (
                <AutocompleteItem
                  key={uuidv4()} // Unique key for each item
                  textValue={item.dial_code}
                >
                  {/* Custom content inside AutocompleteItem */}
                  <div className="flex items-center gap-2">
                    {" "}
                    <span role="img" aria-label="flag">
                      {item.flag}
                    </span>
                    {/* Flag emoji */}
                    <span>{item.dial_code}</span> {/* Country code */}
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>

            <input
              id="phone"
              type="tel" // Use type="tel" for phone numbers
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
              placeholder="e.g., 123 456 7890"
            />
          </div>

          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
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
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
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
            <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
          )}
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

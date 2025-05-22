import { EmailFormValues } from "@/types";
import { FormikProps } from "formik/dist/types";
import { ModalFooter } from "@components/ui/animated-modal";
import { Button } from "@heroui/button";

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
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

      <ModalFooter className="gap-4">
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

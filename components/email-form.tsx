import { EmailFormValues } from "@/types";
import { FormikProps } from "formik/dist/types";
import { ModalFooter } from "@components/ui/animated-modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import Recaptcha from "@/components/ui/recaptcha";

const EmailForm = ({ formik }: { formik: FormikProps<EmailFormValues> }) => {
  const getRecaptcha = (token: string) => {
    if (token) {
      formik.setFieldValue("token", token);
    } else {
      // Reset the token field if recaptcha is not completed
      formik.setFieldValue("token", "");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-4 max-w-sm mx-auto">
        <div>
          <Input
            label="Name"
            type="text"
            variant="bordered"
            id="name"
            isInvalid={formik.touched.name && Boolean(formik.errors.name)}
            errorMessage={formik.touched.name ? formik.errors.name : ""}
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md"
          />
        </div>

        <div>
          <Input
            id="phone"
            type="phone"
            variant="bordered"
            placeholder="e.g. +1 234 567 8900"
            isInvalid={formik.touched.phone && Boolean(formik.errors.phone)}
            errorMessage={formik.touched.phone ? formik.errors.phone : ""}
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md"
          />
        </div>

        <div>
          <Input
            id="email"
            type="email"
            variant="bordered"
            value={formik.values.email}
            isInvalid={formik.touched.email && Boolean(formik.errors.email)}
            errorMessage={formik.touched.email ? formik.errors.email : ""}
            label="Email"
            placeholder="Enter your valid email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md"
          />
        </div>

        <div>
          <Textarea
            id="message"
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.message && Boolean(formik.errors.message)}
            errorMessage={formik.touched.message ? formik.errors.message : ""}
            label="Message"
            variant="bordered"
            placeholder="Type your message here..."
            className="w-full rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <Recaptcha onChange={(token) => getRecaptcha(token as string)} />
        {formik.touched.token && formik.errors.token && (
          <div className="text-red-500 text-sm mt-1 text-center">{formik.errors.token}</div>
        )}
      </div>

      <ModalFooter className="gap-4">
        <Button
          variant="solid"
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

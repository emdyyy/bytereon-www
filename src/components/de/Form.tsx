import {
  Field,
  Form,
  Formik,
  type FormikHelpers,
  type FormikValues,
} from "formik";
import { useState } from "react";
import * as yup from "yup";

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<
    undefined | "success" | "error"
  >();

  const FormSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email ist falsch")
      .required("Dieses Feld ist erforderlich")
      .typeError("Eine Email Adresse ist erforderlich"),
    phoneNumber: yup
      .string()
      .matches(
        /^\+(?:\d ?){6,14}\d$/,
        "Geben Sie die Rufnummer im Format +XX XXX XXX XXX ein."
      )
      .required("Dieses Feld ist erforderlich")
      .typeError("Geben Sie die Rufnummer im Format +XX XXX XXX XXX ein."),
    message: yup
      .string()
      .max(150)
      .required("Dieses Feld ist erforderlich")
      .typeError("Mindestens eine kurze Nachricht ist erforderlich"),
  });

  const onSubmit = async (
    values: FormikValues,
    {
      resetForm,
    }: FormikHelpers<{ email: string; phoneNumber: string; message: string }>
  ) => {
    const data = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      message: values.message,
    };

    const result = await fetch("/api/contact.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      gtag("event", "form_submission_error", {
        event_label: "Contact request not submitted",
      });
      setFormStatus("error");
      return;
    }

    gtag("event", "generate_lead", {
      event_label: "Contact request submitted successfully",
    });

    resetForm();
    setFormStatus("success");
  };

  return (
    <Formik
      method="POST"
      initialValues={{
        email: "",
        phoneNumber: "",
        message: "",
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="w-full bg-lighter flex gap-5 flex-col px-5 py-8 sm:px-8 sm:py-12 md:p-12 max-w-[530px]">
          <div className="flex flex-col gap-3">
            <label htmlFor="email">Email Adresse*</label>
            <Field
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Deine Email Adresse"
              className={`border bg-lighter border-solid p-4 rounded-none outline-none disabled:bg-slate-300 disabled:text-slate-500
              ${
                errors.email && touched.email
                  ? "text-alert border-alert"
                  : "border-slate-300"
              }`}
              disabled={isSubmitting}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-alert">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="phoneNumber">Telefonnummer*</label>
            <Field
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel-national"
              required
              minLength={12}
              maxLength={12}
              placeholder="Deine Telefonnummer"
              className={`border bg-lighter border-solid p-4 rounded-none outline-none disabled:bg-slate-300 disabled:text-slate-500
              ${
                errors.phoneNumber && touched.phoneNumber
                  ? "text-alert border-alert"
                  : "border-slate-300"
              }`}
              disabled={isSubmitting}
            />
          </div>
          {errors.phoneNumber && touched.phoneNumber && (
            <p className="text-sm text-alert">{errors.phoneNumber}</p>
          )}
          <div className="flex flex-col gap-3">
            <label htmlFor="message">Gesprächsthema*</label>
            <Field
              as="textarea"
              id="message"
              name="message"
              required
              autoComplete="off"
              placeholder="Worüber möchtest Du sprechen?"
              rows={3}
              maxLength={150}
              className={`border bg-lighter border-solid p-4 rounded-none outline-none resize-y disabled:bg-slate-300 disabled:text-slate-500
              ${
                errors.message && touched.message
                  ? "text-alert border-alert"
                  : "border-slate-300"
              }`}
              disabled={isSubmitting}
            />
            {errors.message && touched.message && (
              <p className="text-sm text-alert">{errors.message}</p>
            )}
          </div>
          <p className="text-sm">
            Der Verwalter der in das Formular eingegebenen Daten ist Bytereon
            Mateusz Dettlaff. Die personenbezogenen Daten werden zum Zweck der
            Kontaktaufnahme und zur Beantwortung von Fragen verarbeitet. Weitere
            Informationen über Ihre Rechte und die Regeln der Datenverarbeitung
            finden Sie in den Datenschutzbestimmungen.
          </p>
          <button
            type="submit"
            className="bg-primary text-black py-4 px-6 block text-center disabled:bg-slate-300 disabled:text-slate-500"
            disabled={isSubmitting}
          >
            Senden
          </button>
          {formStatus === "success" && (
            <p className="text-lime-500">
              Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Dir
              melden.
            </p>
          )}
          {formStatus === "error" && (
            <p className="text-alert">
              Beim Senden Deiner Anfrage ist ein Fehler aufgetreten. Bitte
              kontaktiere uns direkt unter{" "}
              <a
                href="mailto:contact@bytereon.com"
                className="text-primary hover:text-secondary"
              >
                contact@bytereon.com
              </a>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

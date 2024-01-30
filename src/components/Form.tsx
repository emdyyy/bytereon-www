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
      .email("Email jest nieprawidłowy")
      .required("To pole jest wymagane")
      .typeError("Wymagane jest podanie adresu skrzynki pocztowej"),
    phoneNumber: yup
      .string()
      .matches(/^\+(?:\d ?){6,14}\d$/, "Podaj numer w formacie +XX XXX XXX XXX")
      .required("To pole jest wymagane")
      .typeError("Podaj numer w formacie +XX XXX XXX XXX"),
    message: yup
      .string()
      .max(150)
      .required("To pole jest wymagane")
      .typeError("Wymagane jest podanie krótkiej wiadomości"),
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
            <label htmlFor="email">Adres email*</label>
            <Field
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Twój adres email"
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
            <label htmlFor="phoneNumber">Numer telefonu*</label>
            <Field
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel-national"
              required
              minLength={12}
              maxLength={12}
              placeholder="Twój numer telefonu"
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
            <label htmlFor="message">Temat rozmowy*</label>
            <Field
              as="textarea"
              id="message"
              name="message"
              required
              autoComplete="off"
              placeholder="O czym chcesz porozmawiać?"
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
            Administratorem danych wprowadzonych do formularza jest Bytereon
            Mateusz Dettlaff. Dane osobowe będą przetwarzane w celu nawiązania
            kontaktu i udzielenia odpowiedzi na pytania. Więcej informacji o
            przysługujących prawach i zasadach przetwarzania danych, dostępne
            jest w polityce prywatności.
          </p>
          <button
            type="submit"
            className="bg-primary text-black py-4 px-6 block text-center disabled:bg-slate-300 disabled:text-slate-500"
            disabled={isSubmitting}
          >
            Wyślij
          </button>
          {formStatus === "success" && (
            <p className="text-lime-500">
              Dziękujemy za Twoje zapytanie. Wkrótce odezwiemy się do Ciebie.
            </p>
          )}
          {formStatus === "error" && (
            <p className="text-alert">
              Wystąpił błąd podczas wysyłania zapytania. Prosimy o kontakt z
              nami bezpośrednio pod adresem{" "}
              <a
                href="mailto:biuro@bytereon.com"
                className="text-primary hover:text-secondary"
              >
                biuro@bytereon.com
              </a>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

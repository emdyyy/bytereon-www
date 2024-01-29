import type { APIRoute } from "astro";
import * as yup from "yup";
import nodemailer from "nodemailer";

export const prerender = false;

const ContactFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email jest nieprawidłowy")
    .required("To pole jest wymagane")
    .typeError("Wymagane jest podanie adresu skrzynki pocztowej"),
  phoneNumber: yup
    .string()
    .matches(/^\d{9}$/, "Podaj numer w formacie XXX XXX XXX")
    .min(9)
    .required("To pole jest wymagane")
    .typeError("Podaj numer w formacie XXX XXX XXX"),
  message: yup
    .string()
    .max(150)
    .required("To pole jest wymagane")
    .typeError("Wymagane jest podanie krótkiej wiadomości"),
});

const transport = nodemailer.createTransport({
  host: "s182.cyber-folks.pl",
  port: 465,
  auth: {
    user: "automat@dopasowujemy.pl",
    pass: "+7D6Ctf--)MqSa[R",
  },
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: {
      email: string;
      phoneNumber: string;
      message: string;
    } = await request.json();
    await ContactFormSchema.validate(data);

    const mail = {
      from: '"dopasowujemy.pl" <automat@dopasowujemy.pl>',
      to: "biuro@bytereon.com",
      subject: "Nowe zapytanie z bytereon.com",
      text:
        "Email: " +
        data.email +
        "\nNumer telefonu: " +
        data.phoneNumber +
        "\nWiadomość: " +
        data.message +
        "\n\nWiadomość została wygenerowana automatycznie. Prosimy na nią nie odpowiadać.",
    };

    transport.sendMail(mail, (error) => {
      if (error) {
        throw Error();
      }
    });

    return new Response("Email nadany pomyślnie", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Wystąpił błąd", {
      status: 500,
    });
  }
};

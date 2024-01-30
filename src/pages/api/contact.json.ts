import type { APIRoute } from "astro";
import * as yup from "yup";
import nodemailer from "nodemailer";

export const prerender = false;

const ContactFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email is incorrect")
    .required("This field is required")
    .typeError("A mailbox address is required"),
  phoneNumber: yup
    .string()
    .matches(
      /^\+(?:\d ?){6,14}\d$/,
      "Enter the phone number in the format +XX XXX XXX XXX."
    )
    .required("This field is required")
    .typeError("Enter the phone number in the format +XX XXX XXX XXX."),
  message: yup
    .string()
    .max(150)
    .required("This field is required")
    .typeError("A short message is required"),
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
      from: '"BYTEREON Website" <automat@dopasowujemy.pl>',
      to: "biuro@bytereon.com",
      subject: "New inquiry from bytereon.com",
      text:
        "Email: " +
        data.email +
        "\n\nPhone number: " +
        data.phoneNumber +
        "\n\nMessage: " +
        data.message +
        "\n\nThis message was generated automatically. Please do not respond to it.",
    };

    transport.sendMail(mail, (error) => {
      if (error) {
        throw Error();
      }
    });

    return new Response("Email sent successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred", {
      status: 500,
    });
  }
};

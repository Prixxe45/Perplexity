import nodemailer from 'nodemailer';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendEmail({ to, subject, html, text }) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html: html || text,
    });

    console.log("Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
}









// const transporter = nodemailer.createTransport({
//  service: "gmail",
//   auth: {
//     // type: "OAuth2",
//     user: process.env.GOOGLE_USER,
//     // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     // clientId: process.env.GOOGLE_CLIENT_ID,
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
// });



// transporter.verify()
// .then(() => {
//   console.log("Email transporter is ready");
// })
// .catch((err) => {
//   console.error("Error setting up email transporter", err);
// });

// export async function sendEmail({to, subject, html, text}) {
//   const mailOptions = {
//     from: process.env.GOOGLE_USER,
//     to,
//     subject,
//     html,
//     text
//   }

//  const details = await transporter.sendMail(mailOptions);
//  console.log("Email sent successfully:", details);
// }
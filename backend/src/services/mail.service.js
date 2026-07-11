import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // type: "OAuth2",
    user: process.env.GOOGLE_USER,
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    // clientId: process.env.GOOGLE_CLIENT_ID,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
console.log("GOOGLE_USER:", process.env.GOOGLE_USER);
console.log(
  "GOOGLE_APP_PASSWORD:",
  process.env.GOOGLE_APP_PASSWORD ? "FOUND" : "MISSING",
);


transporter.verify()
.then(() => {
  console.log("Email transporter is ready");
})
.catch((err) => {
  console.error("Error setting up email transporter", err);
});

export async function sendEmail({to, subject, html, text}) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text
  }

 const details = await transporter.sendMail(mailOptions);
 console.log("Email sent successfully:", details);
}
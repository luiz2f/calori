import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = "http://localhost:3000";

export const sendEmailVerification = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "calori-noreply@luizluiz.dev",
      to: email,
      subject: "Calori - Verify your email",
      html: `<p> Click the link to verify your email address: </p> <a href="${confirmationLink}">${confirmationLink}</a>`,
    });
  } catch (error) {
    console.error(error);
    return { error: "Error sending email verification" };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "calori-noreply@luizluiz.dev",
      to: email,
      subject: "Calori - Reset your password",
      html: `<p> Click the link to reset your password: </p> <a href="${confirmationLink}">${confirmationLink}</a>`,
    });
  } catch (error) {
    console.error(error);
    return { error: "Error sending password reset email" };
  }
};

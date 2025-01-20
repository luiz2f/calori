import emailFormat from '@/utils/emailFormat'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.DOMAIN || 'http://localhost:3000'

export const sendEmailVerification = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`

  const htmlContent = emailFormat('verification', confirmationLink)

  try {
    await resend.emails.send({
      from: 'calori-noreply@luizluiz.dev',
      to: email,
      subject: 'Calori - Verificar Email',
      html: htmlContent
    })
  } catch (error) {
    console.error(error)
    return { error: 'Error sending email verification' }
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/reset-password?token=${token}`

  const htmlContent = emailFormat('password', confirmationLink)

  try {
    await resend.emails.send({
      from: 'calori-noreply@luizluiz.dev',
      to: email,
      subject: 'Calori - Redefinir Senha',
      html: htmlContent
    })
  } catch (error) {
    console.error(error)
    return { error: 'Error sending password reset email' }
  }
}

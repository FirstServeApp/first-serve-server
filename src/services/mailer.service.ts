import nodemailer from 'nodemailer'
import { ApiError } from '../middlewares/error.middleware.js'
import { getEnv } from '../utils/env.utils.js'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import getMailHTML from '../utils/mailer.utils.js'

const sendOTPMail = async (otp: string, email: string) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: getEnv('SMTP_USER'),
        pass: getEnv('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as SMTPTransport.MailOptions)

    const mailOptions = {
      from: getEnv('SMTP_USER'),
      to: email,
      subject: 'FirstServe Password Recovery - Your OTP code to reset your password',
      html: getMailHTML(otp),
    }

    await transporter.sendMail(mailOptions)
  } catch (e) {
    throw ApiError.ServerError(e)
  }
}

export default sendOTPMail

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root explicitly (../.. from src/utils -> server/.env)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('MAILER_ENV', {
    envPath,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    MAIL_FROM: process.env.MAIL_FROM,
    NODE_ENV: process.env.NODE_ENV,
  });
}

function createTransport() {
  const hasSmtpConfig = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

  if (hasSmtpConfig) {
    const port = Number(process.env.SMTP_PORT);
    const isSsl = port === 465;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: isSsl,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  throw new Error(
    'SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in environment.'
  );
}

const transporter = createTransport();

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const defaultFrom = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  const mailOptions = {
    from: defaultFrom,
    to,
    subject,
    html,
    text,
  } as const;

  try {
    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Mail debug info (primary transport):', info);
    }
    return info;
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Primary mail transport failed, falling back to jsonTransport:', error?.message || error);
      const fallback = nodemailer.createTransport({ jsonTransport: true });
      const info = await fallback.sendMail(mailOptions);
      // eslint-disable-next-line no-console
      console.log('Mail debug info (fallback jsonTransport):', info);
      return info;
    }
    throw error;
  }
} 
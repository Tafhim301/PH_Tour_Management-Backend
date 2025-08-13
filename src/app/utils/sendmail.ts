/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../confiq/env";
import ejs from "ejs";
import AppError from "../ErrorHelpers/appError";

const transport = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST,
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateData?: Record<string, any>;
  templateName: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  attachments,
  
  templateName,
  templateData,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transport.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        fileName: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
      
    });
    console.log(`\u2709\uFE0F Email sent to ${to} : ${info.messageId}`)
  } catch (error) {
    throw new AppError(401,`Email Error: ${error}`)
  }
};

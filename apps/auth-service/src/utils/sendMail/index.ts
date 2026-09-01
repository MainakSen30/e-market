import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import { existsSync } from "fs";
import { resolveEmailSubject } from "../email-templates/config";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const getTemplateDir = (): string => {
  const candidates = [
    path.join(process.cwd(), "apps/auth-service/src/utils/email-templates"),
    path.join(__dirname, "../email-templates"),
    path.join(__dirname, "email-templates"),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) {
      return dir;
    }
  }

  throw new Error("Email templates directory not found");
};

//render an EJS template
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>,
): Promise<string> => {
  const templatePath = path.join(getTemplateDir(), `${templateName}.ejs`);

  return ejs.renderFile(templatePath, data);
};

//send an email using nodemailer
export const sendEmail = async (
  to: string,
  subject: string | undefined,
  templateName: string,
  data: Record<string, any>,
) => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    const emailSubject = resolveEmailSubject(templateName, data, subject);

    await transporter.sendMail({
      from: `${process.env.SMTP_USER}`,
      to,
      subject: emailSubject,
      html,
    });
    return true;
  } catch (error) {
    console.log("Error sending email", error);
    return false;
  }
};

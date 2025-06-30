import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { SendMailOptions } from 'src/interfaces/mail.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      // Resolve path to template safely
      const templatePath = path.resolve(
        process.cwd(),
        'src',
        'mail',
        'templates',
        `${options.template}.ejs`,
      );

      // Render the EJS template with provided context
      const html = await ejs.renderFile(templatePath, options.context);

      // Send the email
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Car Rental" <no-reply@carrental.com>',
        to: options.to,
        subject: options.subject,
        html,
      });
    } catch (error) {
      console.error('📨 Email sending failed:', error);
      throw new InternalServerErrorException('Email sending failed');
    }
  }
}

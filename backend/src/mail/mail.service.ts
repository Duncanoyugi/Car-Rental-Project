import { Injectable } from '@nestjs/common';
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
      secure: false, // Gmail uses TLS not SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const templatePath = path.resolve(
        process.cwd(),
        'src',
        'mail',
        'templates',
        `${options.template}.ejs`
      );


    const html = await ejs.renderFile(templatePath, options.context);

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"Car Rental" <no-reply@carrental.com>',
      to: options.to,
      subject: options.subject,
      html,
    });
  }
}

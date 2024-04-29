import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/mail.dto';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private mailTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;
    const transport = this.mailTransport();

    const options = {
      from: 'GymGenius', // sender address
      to: recipients, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    };

    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.log('Error sending mail:', error);
      throw error; // Propagate the error to the caller
    }
  }
}

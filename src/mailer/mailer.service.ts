// Import necessary modules and components from NestJS and other libraries
import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/mail.dto';

@Injectable()
export class MailerService {
  // Inject ConfigService to access configuration settings
  constructor(private readonly configService: ConfigService) {}

  // Method to create and configure the Nodemailer transport
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

  // Method to send an email
  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;
    const transport = this.mailTransport();

    const options = {
      from: 'GymGenius',
      to: recipients,
      subject: subject,
      html: html,
    };

    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      throw new BadRequestException('error in sending mail');
    }
  }
}

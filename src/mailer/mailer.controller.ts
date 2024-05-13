import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { sendEmailDto } from './dto/mail.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mailer')
@UseGuards(AuthGuard)
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/email')
  async sendMail(@Body() sendEmailDto: sendEmailDto) {
    try {
      const result = await this.mailerService.sendEmail(sendEmailDto);
      return { message: 'Email sent successfully', result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Failed to send email', error };
    }
  }
}

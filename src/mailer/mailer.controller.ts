import { Body, Controller, Post, UseGuards } from '@nestjs/common'; // Import validation decorators
import { MailerService } from './mailer.service';
import { sendEmailDto } from './dto/mail.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mailer')
@UseGuards(AuthGuard)
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  // POST endpoint for sending email
  @Post('/email')
  async sendMail(@Body() sendEmailDto: sendEmailDto) {
    const result = await this.mailerService.sendEmail(sendEmailDto);
    return { message: 'Email sent successfully', result };
  }
}

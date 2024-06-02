// Import validation decorators
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class sendEmailDto {
  @IsOptional() //from field is optional
  @IsEmail({}, { message: 'Invalid email format for "from" field' })
  from?: string;

  @IsNotEmpty({ message: 'Recipients are required' })
  @IsEmail(
    {},
    { each: true, message: 'Invalid email format for "recipients" field' },
  )
  recipients: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString({ message: 'Subject must be a string' })
  subject: string;

  @IsNotEmpty({ message: 'HTML content is required' })
  @IsString({ message: 'HTML content must be a string' })
  html: string;

  @IsOptional() //text field is optional
  @IsString({ message: 'Text content must be a string' })
  text?: string;
}

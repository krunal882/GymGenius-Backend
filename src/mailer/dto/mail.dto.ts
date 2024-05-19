export class sendEmailDto {
  from?: string;
  recipients: string;
  subject: string;
  html: string;
  text?: string;
}

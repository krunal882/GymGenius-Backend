import { Address } from 'cluster';

export class sendEmailDto {
  from?: Address;
  recipients: Address;
  subject: string;
  html: string;
  text?: string;
}

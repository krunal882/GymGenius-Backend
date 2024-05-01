import { IsNotEmpty, IsString } from 'class-validator';

export class bookmark {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  item: string;
}

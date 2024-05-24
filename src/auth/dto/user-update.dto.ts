import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/utils/role.enum';

export class updateUser {
  @IsNotEmpty()
  @IsString({ message: 'user-name must be a string' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString({ message: 'e-mail must be a string' })
  email: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString({ message: 'user number must be a string' })
  number: string;

  @IsOptional()
  @IsEnum(Role)
  @IsString({ message: 'role must be a string' })
  role: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'user profile pic must be a string' })
  src: string;

  @IsOptional()
  @IsString()
  state: string;
}

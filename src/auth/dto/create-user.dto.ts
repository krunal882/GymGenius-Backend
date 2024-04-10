import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from '../../utils/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please provide a username' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Please provide a valid email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Please provide an age' })
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(12, { message: 'User must be at least 12 years old' })
  age: number;

  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  @IsEnum(Role, { message: 'Invalid role' })
  role: string;

  @IsNotEmpty({ message: 'Please provide a password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+[\]{};:'",<.>/?\s]).{6,18}$/, {
    message:
      'Password must contain at least 1 uppercase letter,1 lowercase letter, 1 special character, and no spaces',
  })
  password: string;

  @IsNotEmpty({ message: 'Please confirm your password' })
  @IsString({ message: 'Password confirmation must be a string' })
  confirmPassword: string;

  @IsOptional()
  state?: string = 'active';
}

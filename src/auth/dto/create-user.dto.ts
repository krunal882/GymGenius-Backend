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
} from 'class-validator'; // Import necessary decorators and validators from 'class-validator' library
import { Role, State } from '../../utils/role.enum'; // Import enums Role and State

// CreateUserDto class defines the structure and validation rules for creating a user
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

  @IsNotEmpty({ message: 'Please provide an number' })
  @IsString({ message: 'number must be a string' })
  number: string;

  @IsOptional() // Role is optional
  @IsString({ message: 'Role must be a string' })
  @IsEnum(Role, { message: 'Invalid role' })
  role: string;

  @IsOptional() // Profile image source is optional
  @IsString({ message: 'Profile image name should be string' })
  src: string;

  @IsOptional() // State is optional
  @IsString({ message: 'state must be a string' })
  @IsEnum(State, { message: 'Invalid state' })
  state: string;

  @IsNotEmpty({ message: 'Please provide a password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' }) // Password must be at least 6 characters long
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+[\]{};:'",<.>/?\s]).{6,18}$/, {
    message:
      'Password must contain at least 1 uppercase letter,1 lowercase letter, 1 special character, and no spaces',
  })
  password: string;

  @IsNotEmpty({ message: 'Please confirm your password' })
  @IsString({ message: 'Password confirmation must be a string' })
  confirmPassword: string;
}

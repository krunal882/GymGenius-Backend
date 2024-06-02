// Import necessary decorators and validators from 'class-validator' library
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// LoginUserDto class defines the structure and validation rules for logging in a user
export class LoginUserDto {
  @IsNotEmpty({ message: 'Please provide a valid email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Please provide a password' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

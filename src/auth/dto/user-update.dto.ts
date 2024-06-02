// Import necessary decorators and validators from 'class-validator' library
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/utils/role.enum'; // Import Role enum from utils

// updateUser class defines the structure and validation rules for updating a user's details
export class updateUser {
  @IsNotEmpty({ message: 'User name is required' })
  @IsString({ message: 'User name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber({}, { message: 'Age must be a number' })
  age: number;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  number: string;

  @IsOptional() // Role is optional
  @IsString({ message: 'Role must be a string' })
  @IsEnum(Role, { message: 'Invalid role' })
  role?: string;

  @IsOptional() // Profile image source is optional
  @IsNotEmpty({ message: 'Profile image is required' })
  @IsString({ message: 'Profile image name must be a string' })
  src?: string;

  @IsOptional() // State is optional
  @IsString({ message: 'State must be a string' })
  state?: string;
}

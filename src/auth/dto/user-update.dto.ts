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
  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'user-name must be a string' })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString({ message: 'e-mail must be a string' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  @IsString({ message: 'role must be a string' })
  role: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'user profile pic must be a string' })
  image: string;

  @IsOptional()
  @IsString()
  state: string = 'active';
}

// Import necessary decorators and validators from 'class-validator' library
import { IsNotEmpty, IsString } from 'class-validator';

// ChangePasswordDto class defines the structure and validation rules for changing a user's password
export class ChangePasswordDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'Old password is required' })
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  newPassword: string;
}

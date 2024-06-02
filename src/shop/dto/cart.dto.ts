// Import necessary decorators from class-validator to enforce validation rules
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class cartDto {
  @IsNotEmpty({ message: 'please provide id of the user' })
  @IsString({ message: 'UserId must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'please provide id of the product' })
  @IsArray({ message: 'ProductId must be an array' })
  product: {
    productId: string;
    status: string;
  }[];
}

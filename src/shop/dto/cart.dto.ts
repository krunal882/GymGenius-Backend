import { IsNotEmpty, IsString } from 'class-validator';

export class cartDto {
  //   @IsNotEmpty({ message: 'please provide category of the product' })
  //   @IsString({ message: 'Product category must be a string' })
  //   userId: string;

  @IsNotEmpty({ message: 'please provide category of the product' })
  @IsString({ message: 'Product category must be a string' })
  productId: string;
}

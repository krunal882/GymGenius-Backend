// Import necessary decorators from class-validator to enforce validation rules
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'please provide category of the product' })
  @IsString({ message: 'Product category must be a string' })
  category: string;

  @IsNotEmpty({ message: 'please provide image  ' })
  @IsString({ message: 'image name must be a string' })
  cloudImg: string;

  @IsOptional() // product brand field is optional
  @IsString({ message: 'brand name must be a string' })
  brand?: string;

  @IsNotEmpty({ message: 'please provide title of product ' })
  @IsString({ message: 'product title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'please provide price of product ' })
  @IsNumber({}, { message: 'product price must be a number' })
  price: number;

  @IsOptional() // products original price field is optional
  @IsString({ message: 'original price must be a string' })
  original_price?: string;

  @IsOptional() // off field is optional
  @IsString({ message: 'off price must be a string' })
  off?: string;

  @IsOptional() // product tag field is optional
  @IsString({ message: 'product tag must be a string' })
  tag?: string;

  @IsOptional() // state of product is optional
  @IsEnum(['active', 'inactive'], {
    message: 'product state must be active or de-active',
  })
  @IsString({ message: 'product tag must be a string' })
  state?: string;

  @IsOptional() // quantity of product is optional
  @IsString({ message: 'product quantity' })
  quantity?: string;
}

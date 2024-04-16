import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'please provide category of the product' })
  @IsString({ message: 'Product category must be a string' })
  category: string;

  @IsNotEmpty({ message: 'please provide image  ' })
  @IsString({ message: 'image name must be a string' })
  src: string;

  @IsNotEmpty({ message: 'please provide brand name of product ' })
  @IsString({ message: 'brand name must be a string' })
  brand: string;

  @IsNotEmpty({ message: 'please provide title of product ' })
  @IsString({ message: 'product title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'please provide price of product ' })
  @IsString({ message: 'product price must be a string' })
  price: string;

  @IsOptional()
  @IsString({ message: 'original price must be a string' })
  original_price: string;

  @IsOptional()
  @IsString({ message: 'off price must be a string' })
  off: string;

  @IsOptional()
  @IsString({ message: 'product tag must be a string' })
  tag: string;

  @IsOptional()
  @IsEnum(['active', 'de-active'], {
    message: 'product state must be active or de-active',
  })
  @IsString({ message: 'product tag must be a string' })
  state: string;
}

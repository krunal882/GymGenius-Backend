// Import necessary validators from 'class-validator'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class dietFoodDto {
  @IsNotEmpty({ message: 'please provide the food name' })
  @IsString({ message: 'food name must be in string' })
  name: string;

  @IsNotEmpty({ message: 'please provide the food quantity' })
  @IsString({ message: 'food quantity must be in string' })
  quantity: string;

  @IsNotEmpty({ message: 'please provide calories of diet plan' })
  @IsNumber()
  calories: number;

  @IsNotEmpty({ message: 'please provide protein of diet plan' })
  @IsNumber()
  protein: number;

  @IsNotEmpty({ message: 'please provide carbohydrates of diet plan' })
  @IsNumber()
  carbohydrates: number;

  @IsNotEmpty({ message: 'please provide fat of diet plan' })
  @IsNumber()
  fat: number;

  @IsNotEmpty({ message: 'please provide fiber of diet plan' })
  @IsNumber()
  fiber: number;
}

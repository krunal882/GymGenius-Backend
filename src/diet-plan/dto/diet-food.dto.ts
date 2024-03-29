import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class dietFoodDto {
  @IsNotEmpty({ message: 'please provide the food name' })
  @IsString({ message: 'food name must be in string' })
  name: string;

  @IsNotEmpty({ message: 'please provide the food quantity' })
  @IsString({ message: 'food quantity must be in string' })
  quantity: string;

  @IsNotEmpty({ message: 'please provide total days of diet plan' })
  @IsNumber({}, { message: 'diet plan total days must be a number' })
  calories: number;

  @IsNotEmpty({ message: 'please provide protein of diet plan' })
  @IsNumber({}, { message: 'diet plan protein must be a number' })
  protein: number;

  @IsNotEmpty({ message: 'please provide carbohydrates of diet plan' })
  @IsNumber({}, { message: 'diet plan carbohydrates must be a number' })
  carbohydrates: number;

  @IsNotEmpty({ message: 'please provide fat of diet plan' })
  @IsNumber({}, { message: 'diet plan fat must be a number' })
  fat: number;

  @IsNotEmpty({ message: 'please provide fiber of diet plan' })
  @IsNumber({}, { message: 'diet plan fiber must be a number' })
  fiber: number;
}

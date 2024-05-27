import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class dietFoodDto {
  @IsNotEmpty({ message: 'please provide the food name' })
  @IsString({ message: 'food name must be in string' })
  name: string;

  @IsNotEmpty({ message: 'please provide the food quantity' })
  @IsString({ message: 'food quantity must be in string' })
  quantity: string;

  @IsNotEmpty({ message: 'please provide total days of diet plan' })
  @IsString({ message: 'food calories must be in string' })
  @IsPositive({ message: 'Calories must be a positive number' })
  calories: string;

  @IsNotEmpty({ message: 'please provide protein of diet plan' })
  @IsString({ message: 'food protein must be in string' })
  @IsPositive({ message: 'Calories must be a positive number' })
  protein: string;

  @IsNotEmpty({ message: 'please provide carbohydrates of diet plan' })
  @IsString({ message: 'food carbohydrates must be in string' })
  @IsPositive({ message: 'Calories must be a positive number' })
  carbohydrates: string;

  @IsNotEmpty({ message: 'please provide fat of diet plan' })
  @IsString({ message: 'food fat must be in string' })
  @IsPositive({ message: 'Calories must be a positive number' })
  fat: string;

  @IsNotEmpty({ message: 'please provide fiber of diet plan' })
  @IsString({ message: 'food fiber must be in string' })
  @IsPositive({ message: 'Calories must be a positive number' })
  fiber: string;
}

// Import necessary validators from 'class-validator'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { dietFoodDto } from './diet-food.dto';
import { Type } from 'class-transformer';

export class dietMeal {
  @IsNotEmpty({ message: 'please provide the day of the meal' })
  @IsString({ message: 'day must be in string' })
  day: string;

  @IsNotEmpty({ message: 'please provide the type of the meal' })
  @IsString({ message: 'meal type must be in string' })
  meal_type: string;

  @IsNotEmpty({ message: 'please provide the food detail' })
  @IsArray({ message: 'meal should be an array' })
  @ValidateNested({ each: true })
  @Type(() => dietFoodDto)
  foods: dietFoodDto[];
}

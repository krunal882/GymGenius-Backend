// Import necessary validators from 'class-validator'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { dietMeal } from './diet-meal.dto';
import { Type } from 'class-transformer';

export class updateDiet {
  @IsNotEmpty({ message: 'please provide the diet plan name' })
  @IsString({ message: 'diet plan name must be a string' })
  plan_name: string;

  @IsNotEmpty({ message: 'please provide the diet plan type ' })
  @IsString({ message: 'diet plan type must be a string' })
  diet_type: string;

  @IsNotEmpty({ message: 'please provide the diet plan purpose' })
  @IsString({ message: 'diet plan purpose must be a string' })
  purpose: string;

  @IsNotEmpty({ message: 'please provide the diet plan total days' })
  @IsNumber({}, { message: 'diet plan total days must be a number' })
  total_days: number;

  @IsNotEmpty({ message: 'please provide the meals of diet plan' })
  @IsArray({ message: 'meal should be an array' })
  @ValidateNested({ each: true })
  @Type(() => dietMeal)
  meals: dietMeal[];

  @IsNotEmpty({ message: 'please provide the image of diet plan' })
  @IsString({ message: 'diet plan image name must be a string' })
  src: string;
}

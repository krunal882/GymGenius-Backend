import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { dietMeal } from './diet-meal.dto';

export class updateDiet {
  @IsNotEmpty()
  @IsString({ message: 'diet plan name must be a string' })
  plan_name: string;

  @IsNotEmpty()
  @IsString({ message: 'diet plan type must be a string' })
  diet_type: string;

  @IsNotEmpty()
  @IsString({ message: 'diet plan purpose must be a string' })
  purpose: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'diet plan total days must be a number' })
  total_days: number;

  @IsNotEmpty()
  @IsArray({ message: 'meal should be an array' })
  meals: dietMeal[];

  @IsNotEmpty()
  @IsString({ message: 'diet plan image name must be a string' })
  src: string;
}

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { dietMeal } from './diet-meal.dto';

export class updateDiet {
  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'diet plan name must be a string' })
  plan_name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'diet plan type must be a string' })
  diet_type: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'diet plan purpose must be a string' })
  purpose: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber({}, { message: 'diet plan total days must be a number' })
  total_days: number;

  @IsNotEmpty()
  @IsOptional()
  @IsArray({ message: 'meal should be an array' })
  meals: dietMeal[];
}

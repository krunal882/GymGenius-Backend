import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecipeDto } from '../dto/food-recipe.dto';

class NutritionItemDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Nutritional value must be provided' })
  @IsNumber({}, { message: 'Nutritional value must be a number' })
  value: number;
}

export class updateFoodDto {
  @IsOptional()
  @IsNotEmpty({ message: 'please provide food item name' })
  @IsString({ message: 'food item name must be a string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide food item image' })
  @IsString({ message: 'image name must be a string' })
  image: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide food item category' })
  @IsString({ message: 'category name must be a string' })
  category: string;

  @IsOptional()
  @IsNotEmpty({ message: 'please provide health benefits of food item ' })
  @IsArray({ message: 'health benefits  must be an array' })
  @ArrayNotEmpty({ message: 'health benefits cannot be empty' })
  @IsString({ each: true, message: 'health benefits must be a string' })
  health_benefits: string[];

  @IsOptional()
  @IsNotEmpty({ message: 'Please provide nutritional values for food items' })
  @ValidateNested({ each: true })
  @Type(() => NutritionItemDto)
  nutritions: Map<string, number>;

  @IsOptional()
  @IsNotEmpty({ message: 'Please provide culinary uses of food items' })
  @IsArray({ message: 'Culinary uses must be an array' })
  @ArrayNotEmpty({ message: 'Culinary uses array cannot be empty' })
  @IsString({ each: true, message: 'Each culinary use must be a string' })
  culinary_uses: string[];

  @IsOptional()
  @IsNotEmpty({ message: 'Please provide varieties of food items' })
  @IsArray({ message: 'Varieties of food item must be an array' })
  @ArrayNotEmpty({ message: 'Varieties array of food item cannot be empty' })
  @IsString({ each: true, message: 'Each variety must be a string' })
  varieties: string[];

  @IsOptional()
  @IsNotEmpty({ message: 'Please provide fun facts and trivia of food items' })
  @IsArray({ message: 'Fun facts and trivia must be an array' })
  @ArrayNotEmpty({ message: 'Fun facts and trivia array cannot be empty' })
  @IsString({
    each: true,
    message: 'Each fun fact and trivia must be a string',
  })
  fun_facts_and_trivia: string[];

  @IsOptional()
  @IsNotEmpty({
    message: 'Please provide recipes and serving ideas of food items',
  })
  @IsArray({ message: 'Recipes and serving ideas must be an array' })
  @ArrayNotEmpty({ message: 'Recipes and serving ideas array cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => RecipeDto)
  recipes_and_serving_ideas: RecipeDto[];
}

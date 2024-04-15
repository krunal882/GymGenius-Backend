import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecipeDto } from './food-recipe.dto';

export class foodNutritionDto {
  @IsNotEmpty({ message: 'please provide food item name' })
  @IsString({ message: 'food item name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'please provide food item image' })
  @IsString({ message: 'image name must be a string' })
  image: string;

  @IsNotEmpty({ message: 'please provide food item category' })
  @IsString({ message: 'category name must be a string' })
  category: string;

  @IsNotEmpty({ message: 'please provide health benefits of food item ' })
  @IsArray({ message: 'health benefits  must be an array' })
  @IsString({ each: true, message: 'health benefits must be a string' })
  health_benefits: string[];

  @IsNotEmpty({ message: 'Please provide nutritional values for food items' })
  @IsObject({ message: 'Nutritions must be an object' })
  nutritions: Record<string, number>; // Changed to accept plain number values

  @IsNotEmpty({ message: 'Please provide culinary uses of food items' })
  @IsArray({ message: 'Culinary uses must be an array' })
  @IsString({ each: true, message: 'Each culinary use must be a string' })
  culinary_uses: string[];

  @IsNotEmpty({ message: 'Please provide varieties of food items' })
  @IsArray({ message: 'Varieties of food item must be an array' })
  @IsString({ each: true, message: 'Each variety must be a string' })
  varieties: string[];

  @IsNotEmpty({ message: 'Please provide fun facts and trivia of food items' })
  @IsArray({ message: 'Fun facts and trivia must be an array' })
  @IsString({
    each: true,
    message: 'Each fun fact and trivia must be a string',
  })
  fun_facts_and_trivia: string[];

  @IsNotEmpty({
    message: 'Please provide recipes and serving ideas of food items',
  })
  @IsArray({ message: 'Recipes and serving ideas must be an array' })
  @ValidateNested({ each: true })
  recipes_and_serving_ideas: RecipeDto[];
}

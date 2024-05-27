import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RecipeDto } from '../dto/food-recipe.dto';

export class updateFoodDto {
  @IsNotEmpty({ message: 'please provide food item name' })
  @IsString({ message: 'food item name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'please provide food item image' })
  @IsString({ message: 'image must be a string' })
  cloudImg: string;

  @IsNotEmpty({ message: 'please provide food item category' })
  @IsString({ message: 'category name must be a string' })
  category: string;

  @IsNotEmpty({ message: 'please provide health benefits of food item ' })
  @IsArray({ message: 'health benefits must be an array' })
  @IsString({ each: true, message: 'health benefits must be a string' })
  health_benefits: string[];

  @IsNotEmpty({ message: 'Please provide nutritional values for food items' })
  @IsObject({ message: 'Nutritional values must be provided as an object' })
  nutritions: { [key: string]: number };

  @IsNotEmpty({ message: 'Please provide culinary uses of food items' })
  @IsString({ each: true, message: 'Each culinary use must be a string' })
  culinary_uses: string;

  @IsOptional()
  @IsString({ each: true, message: 'Each variety must be a string' })
  varieties: string;

  @IsOptional()
  @IsString({
    each: true,
    message: 'Each fun fact and trivia must be a string',
  })
  fun_facts_and_trivia: string;

  @IsNotEmpty({
    message: 'Please provide recipes and serving ideas of food items',
  })
  @IsArray({ message: 'Recipes and serving ideas must be an array' })
  @ArrayNotEmpty({ message: 'Recipes and serving ideas array cannot be empty' })
  recipes_and_serving_ideas: RecipeDto[];
}

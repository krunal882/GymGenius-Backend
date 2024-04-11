import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RecipeDto {
  @IsNotEmpty({ message: 'Please provide recipe name' })
  @IsString({ message: 'Recipe name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Please provide recipe ingredients' })
  @IsArray({ message: 'Recipe ingredients must be an array' })
  @ArrayNotEmpty({ message: 'Recipe ingredients array cannot be empty' })
  @IsString({ each: true, message: 'Each recipe ingredient must be a string' })
  ingredients: string[];

  @IsNotEmpty({ message: 'Please provide recipe instructions' })
  @IsArray({ message: 'Recipe instructions must be an array' })
  @ArrayNotEmpty({ message: 'Recipe instructions array cannot be empty' })
  @IsString({ each: true, message: 'Each recipe instruction must be a string' })
  instructions: string[];
}

import { IsNotEmpty, IsString } from 'class-validator'; // Import validation decorators

export class RecipeDto {
  @IsNotEmpty({ message: 'Please provide recipe name' })
  @IsString({ message: 'Recipe name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Please provide recipe ingredients' })
  @IsString({ each: true, message: 'Each recipe ingredient must be a string' })
  ingredients: string;

  @IsNotEmpty({ message: 'Please provide recipe instructions' })
  @IsString({ each: true, message: 'Each recipe instruction must be a string' })
  instructions: string;
}

import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'; // Import validation decorators
import { ForceType, ExerciseLevel } from '../../utils/role.enum'; // Import enums for ForceType and ExerciseLevel

export class exerciseDto {
  @IsNotEmpty({ message: 'Please provide exercise name' })
  @IsString({ message: 'Exercise name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Please provide force type of exercise' })
  @IsString({ message: 'Force name must be a string' })
  @IsEnum(ForceType, { message: 'Force must be one of: push, pull, static' })
  force: string;

  @IsNotEmpty({ message: 'Please provide level of exercise' })
  @IsString({ message: 'Level must be a string' })
  @IsEnum(ExerciseLevel, {
    message: 'Exercise level must be one of: beginner, intermediate, expert',
  })
  level: string;

  @IsNotEmpty({ message: 'Please provide image of exercise' })
  @IsString({ message: 'Image must be a string' })
  cloudImg: string;

  @IsOptional() // 'mechanic' is optional
  @IsString({ message: 'Mechanic must be a string' })
  mechanic?: string;

  @IsNotEmpty({
    message: 'Please provide equipment name needed to perform exercise',
  })
  @IsString({ message: 'Equipment name must be a string' })
  equipment: string;

  @IsNotEmpty({ message: 'Please provide category of exercise' })
  @IsString({ message: 'Category name must be a string' })
  category: string;

  @ArrayNotEmpty({
    message: 'Please provide at least one primary muscle for the exercise',
  })
  @ArrayMinSize(1, {
    message: 'Please provide at least one primary muscle for the exercise',
  })
  @IsString({ each: true, message: 'Each primary muscle must be a string' })
  primaryMuscles: string[];

  @IsOptional() // 'secondaryMuscles' is optional
  @ArrayNotEmpty({ message: 'Please provide valid secondary muscles' })
  @IsString({ each: true, message: 'Each secondary muscle must be a string' })
  secondaryMuscles?: string[];

  @ArrayNotEmpty({ message: 'Please provide instructions for the exercise' })
  @ArrayMinSize(1, {
    message: 'Please provide at least one instruction for the exercise',
  })
  @IsString({ each: true, message: 'Each instruction must be a string' })
  instructions: string[];
}

import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'; // Import validation decorators
import { ForceType, ExerciseLevel } from '../../utils/role.enum'; // Import enums for ForceType and ExerciseLevel

export class updateExercise {
  @IsString({ message: 'Exercise name must be a string' })
  @IsNotEmpty({ message: 'Exercise name is required' })
  name: string;

  @IsString({ message: 'Force must be a string' })
  @IsNotEmpty({ message: 'Force is required' })
  @IsEnum(ForceType, { message: 'Force must be one of: push, pull, static' })
  force: string;

  @IsString({ message: 'Level must be a string' })
  @IsNotEmpty({ message: 'Level is required' })
  @IsEnum(ExerciseLevel, {
    message: 'Exercise level must be one of: beginner, intermediate, expert',
  })
  level: string = ExerciseLevel.INTERMEDIATE; // Set default value for 'level' if not provided

  @IsOptional() // 'mechanic' is optional
  @IsString({ message: 'Mechanic must be a string' })
  mechanic?: string;

  @IsString({ message: 'Equipment name must be a string' })
  @IsNotEmpty({ message: 'Equipment name is required' })
  equipment: string;

  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  category: string;

  @ArrayNotEmpty({ message: 'Primary muscles should not be empty' })
  @IsArray({ message: 'Primary muscles should be an array of strings' })
  primaryMuscles: string[];

  @IsOptional() // 'secondaryMuscles' is optional
  @IsArray({ message: 'secondaryMuscles should be an array of string' })
  secondaryMuscles?: string[];

  @ArrayNotEmpty({ message: 'instructions should not be empty' })
  @IsArray({ message: 'instructions should be an array of strings' })
  instructions: string[];
}

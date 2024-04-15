import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ForceType, ExerciseLevel } from '../../utils/role.enum';
import { Prop } from '@nestjs/mongoose';

export class updateExercise {
  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'Exercise name must be a string' })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'force name must be a string' })
  @IsEnum(ForceType, { message: 'Force must be one of: push, pull, static' })
  force: string;

  @IsNotEmpty()
  @IsOptional()
  @Prop({ default: ExerciseLevel.INTERMEDIATE })
  @IsString({ message: 'level  must be a string' })
  @IsEnum(ExerciseLevel, {
    message: 'Exercise level must be one of: beginner,intermediate,expert',
  })
  level: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'mechanic must be a string' })
  mechanic: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'Equipment name must be a string' })
  equipment: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'Category name must be a string' })
  category: string;

  @IsNotEmpty()
  @IsOptional()
  @IsArray({ message: 'Primary muscles must be an array' })
  @ArrayNotEmpty({ message: 'Primary muscles array cannot be empty' })
  @IsString({ each: true, message: 'Each primary muscle must be a string' })
  primaryMuscles: string[];

  @IsNotEmpty()
  @IsOptional()
  @IsArray({ message: 'secondary muscles must be an array' })
  @IsString({ each: true, message: 'Each secondary muscle must be a string' })
  secondaryMuscles: string[];

  @IsNotEmpty()
  @IsOptional()
  @IsArray({ message: 'Instructions must be an array' })
  @ArrayNotEmpty({ message: 'Instructions array cannot be empty' })
  @IsString({ each: true, message: 'Each instruction must be a string' })
  instructions: string[];
}

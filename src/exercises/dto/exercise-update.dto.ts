import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ForceType, ExerciseLevel } from '../../utils/role.enum';
import { Prop } from '@nestjs/mongoose';

export class updateExercise {
  @IsNotEmpty()
  @IsString({ message: 'Exercise name must be a string' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'force name must be a string' })
  @IsEnum(ForceType, { message: 'Force must be one of: push, pull, static' })
  force: ForceType;

  @IsNotEmpty()
  @Prop({ default: ExerciseLevel.INTERMEDIATE })
  @IsString({ message: 'level  must be a string' })
  @IsEnum(ExerciseLevel, {
    message: 'Exercise level must be one of: beginner,intermediate,expert',
  })
  level: string;

  @IsNotEmpty()
  @IsString({ message: 'mechanic must be a string' })
  mechanic: string;

  @IsNotEmpty()
  @IsString({ message: 'Equipment name must be a string' })
  equipment: string;

  @IsNotEmpty()
  @IsString({ message: 'Category name must be a string' })
  category: string;

  @IsNotEmpty()
  @IsArray({ message: 'primaryMuscles should be an array of string' })
  @IsString({ message: 'Each primary muscle must be a string' })
  primaryMuscles: string[];

  @IsOptional()
  @IsArray({ message: 'secondaryMuscles should be an array of string' })
  @IsString({ message: 'Each secondary muscle must be a string' })
  secondaryMuscles: string[];

  @IsNotEmpty()
  @IsString({ each: true, message: 'Each instruction must be a string' })
  instructions: string;
}

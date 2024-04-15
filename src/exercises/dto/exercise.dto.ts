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
export class exerciseDto {
  @IsNotEmpty({ message: 'please provide exercise name' })
  @IsString({ message: 'Exercise name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'please provide force type of exercise' })
  @IsString({ message: 'force name must be a string' })
  @IsEnum(ForceType, { message: 'Force must be one of: push, pull, static' })
  force: string;

  @Prop({ default: ExerciseLevel.INTERMEDIATE })
  @IsNotEmpty({ message: 'please provide level of exercise' })
  @IsString({ message: 'level  must be a string' })
  @IsEnum(ExerciseLevel, {
    message: 'Exercise level must be one of: beginner,intermediate,expert',
  })
  level: string;

  @IsOptional()
  @IsString({ message: 'mechanic must be a string' })
  mechanic: string;

  @IsNotEmpty({
    message: 'please provide equipment name needed to perform exrecise',
  })
  @IsString({ message: 'Equipment name must be a string' })
  equipment: string;

  @IsNotEmpty({ message: 'please provide Category of exercise' })
  @IsString({ message: 'Category name must be a string' })
  category: string;

  @IsNotEmpty({ message: 'Please provide target primary muscle of exercise' })
  @IsArray({ message: 'Primary muscles must be an array' })
  @ArrayNotEmpty({ message: 'Primary muscles array cannot be empty' })
  @IsString({ each: true, message: 'Each primary muscle must be a string' })
  primaryMuscles: string[];

  @IsOptional()
  @IsArray({ message: 'secondary muscles must be an array' })
  @IsString({ each: true, message: 'Each secondary muscle must be a string' })
  secondaryMuscles: string[];

  @IsNotEmpty({ message: 'Please provide instructions for the exercise' })
  @IsArray({ message: 'Instructions must be an array' })
  @ArrayNotEmpty({ message: 'Instructions array cannot be empty' })
  @IsString({ each: true, message: 'Each instruction must be a string' })
  instructions: string[];
}

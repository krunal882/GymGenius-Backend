import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Import decorators and schema factory from NestJS Mongoose
import { Document } from 'mongoose';
import { ForceType, ExerciseLevel } from '../../utils/role.enum'; // Import enums for ForceType and ExerciseLevel

@Schema()
export class Exercise extends Document {
  @Prop({
    required: [true, 'Please provide the exercise name'],
    type: String,
  })
  name: string;

  @Prop({
    required: [true, 'Please provide the exercise force'],
    type: String,

    enum: [ForceType],
  })
  force: string;

  @Prop({
    required: [true, 'Please provide the exercise image'],
    type: String,
  })
  cloudImg: string;

  @Prop({
    enum: [ExerciseLevel], // Allowed values are from the ExerciseLevel enum
    default: 'intermediate', // Default value is 'intermediate'
    type: String,
  })
  level: string;

  @Prop({ type: String })
  mechanic: string;

  @Prop({
    required: [true, 'please provide the equipment required for exercise'],
    type: String,
  })
  equipment: string;

  @Prop({
    required: [true, 'please provide the category of the exercise'],
    type: String,
  })
  category: string;

  @Prop({
    required: [true, 'please provide target primary muscle of exercise'],
    type: [String],
  })
  primaryMuscles: string[];

  @Prop({ type: [String] })
  secondaryMuscles: string[];

  @Prop({
    required: [true, 'please provide instructions for the exercise'],
    type: [String],
  })
  instructions: string[];
}

// Create Exercise schema using SchemaFactory
export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ForceType, ExerciseLevel } from '../../utils/role.enum';

@Schema()
export class Exercise extends Document {
  @Prop({
    required: [true, 'Please provide the exercise name'],
  })
  name: string;

  @Prop({
    required: [true, 'Please provide the exercise name'],
    enum: [ForceType],
  })
  force: string;

  @Prop({
    enum: [ExerciseLevel],
    default: 'intermediate',
  })
  level: string;

  @Prop()
  mechanic: string;

  @Prop({
    required: [true, 'please provide the equipment required for exercise'],
  })
  equipment: string;

  @Prop({ required: [true, 'please provide the category of the exercise'] })
  category: string;

  @Prop({
    required: [true, 'please provide target primary muscle of exercise'],
  })
  primaryMuscles: string[];

  @Prop()
  secondaryMuscles: string[];

  @Prop({ required: [true, 'please provide instructions for the exercise'] })
  instructions: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

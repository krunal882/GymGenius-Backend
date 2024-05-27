import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ForceType, ExerciseLevel } from '../../utils/role.enum';

@Schema()
export class Exercise extends Document {
  @Prop({
    required: [true, 'Please provide the exercise name'],
    type: String,
  })
  name: string;

  @Prop({
    required: [true, 'Please provide the exercise name'],
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
    enum: [ExerciseLevel],
    default: 'intermediate',
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

  @Prop({ type: String })
  secondaryMuscles: string[];

  @Prop({
    required: [true, 'please provide instructions for the exercise'],
    type: [String],
  })
  instructions: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

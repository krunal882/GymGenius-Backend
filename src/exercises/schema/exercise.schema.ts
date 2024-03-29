import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Exercise extends Document {
  @Prop({
    required: [true, 'Please provide the exercise name'],
  })
  name: string;

  @Prop({
    required: [true, 'Please provide the exercise name'],
    enum: ['push', 'pull', 'static'],
  })
  force: string;

  // @Prop({
  //   required: [true, 'Please provide the type of exercise'],
  //   enum: ['strength', 'cardio', 'weightlifting', 'powerlifting', 'stretching'],
  // })
  // type: string;

  // @Prop({
  //   required: [true, 'Please provide the muscle targeted by the exercise'],
  //   enum: [
  //     'biceps',
  //     'calves',
  //     'chest',
  //     'forearms',
  //     'hamstrings',
  //     'lats',
  //     'lower_back',
  //     'middle_back',
  //     'neck',
  //     'traps',
  //     'triceps',
  //   ],
  // })
  // muscle: string;

  @Prop({
    enum: ['beginner', 'intermediate', 'expert'],
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
  // @Prop({ enum: ['favorite'] })
  // category: string;

  @Prop({ required: [true, 'please provide instructions for the exercise'] })
  instructions: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

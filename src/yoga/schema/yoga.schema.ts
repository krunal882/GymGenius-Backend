import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class YogaPose extends Document {
  @Prop({
    required: [true, 'Please provide category of yoga'],
    type: String,
  })
  category_name: string;

  @Prop({
    required: [true, 'please provide description of the category'],
    type: String,
  })
  category_description: string;

  @Prop({
    required: [true, 'please provide english name of the yoga-pose'],
    type: String,
  })
  english_name: string;

  @Prop({ required: false, type: String })
  sanskrit_name_adapted?: string;

  @Prop({
    required: [true, 'please provide sanskrit name of the yoga-pose'],
    type: String,
  })
  sanskrit_name: string;

  @Prop({
    required: [true, 'please provide translation of yga-pose name'],
    type: String,
  })
  translation_name: string;

  @Prop({
    required: [true, 'please provide description of the yoga-pose'],
    type: String,
  })
  pose_description: string;

  @Prop({
    required: [true, 'please provide benefits of the yoga-pose'],
    type: String,
  })
  pose_benefits: string;

  @Prop({
    required: [
      true,
      'please provide png photo or source link of the yoga pose',
    ],
    type: String,
  })
  url_png: string;
}

export const YogaPoseSchema = SchemaFactory.createForClass(YogaPose);

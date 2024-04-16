import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { YogaCategory } from 'src/utils/role.enum';

@Schema()
export class YogaPose extends Document {
  @Prop({
    required: [true, 'Please provide category of yoga'],
    enum: [YogaCategory],
  })
  category_name: string;

  @Prop({ required: [true, 'please provide description of the category'] })
  category_description: string;

  @Prop({ required: [true, 'please provide english name of the yoga-pose'] })
  english_name: string;

  @Prop({ required: false })
  sanskrit_name_adapted: string;

  @Prop({ required: [true, 'please provide sanskrit name of the yoga-pose'] })
  sanskrit_name: string;

  @Prop({
    required: [true, 'please provide translation of yga-pose name'],
  })
  translation_name: string;

  @Prop({ required: [true, 'please provide description of the yoga-pose'] })
  pose_description: string;

  @Prop({ required: [true, 'please provide benefits of the yoga-pose'] })
  pose_benefits: string;

  @Prop({
    required: [
      true,
      'please provide png photo or source link of the yoga pose',
    ],
  })
  url_png: string;
}

export const YogaPoseSchema = SchemaFactory.createForClass(YogaPose);

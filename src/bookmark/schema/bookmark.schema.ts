import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Bookmark extends Document {
  @Prop({
    required: [true, 'Please provide user Id'],
    type: String,
  })
  userId: string;

  @Prop({
    required: [true, 'Please provide Item'],
    type: SchemaTypes.Mixed,
  })
  item: {
    exercise?: string[];
    yoga?: string[];
    diet?: string[];
    nutrition?: string[];
  };
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

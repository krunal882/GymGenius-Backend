import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Import necessary decorators and utilities from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'; // Import Document and SchemaTypes from 'mongoose'

@Schema()
export class Bookmark extends Document {
  @Prop({
    required: [true, 'Please provide user Id'],
    type: String,
  })
  userId: string;

  @Prop({
    required: [true, 'Please provide Item'],
    type: SchemaTypes.Mixed, // Define the type of the property as Mixed, allowing for various data types
  })
  item: {
    exercise?: string[];
    yoga?: string[];
    diet?: string[];
    nutrition?: string[];
  };
}
// Create a mongoose schema for the Bookmark class using SchemaFactory
export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

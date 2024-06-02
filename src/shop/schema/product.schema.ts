// Import necessary decorators and classes from @nestjs/mongoose and mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({
    required: [true, 'please provide category of the product'],
    type: String,
  })
  category: string;

  // src property which is optional
  @Prop({
    required: false,
    type: String,
  })
  src: string;

  // cloudImg property which is optional
  @Prop({
    required: false,
    type: String,
  })
  cloudImg: string;

  @Prop({
    required: [true, 'please provide valid brand name of product'],
    type: String,
  })
  brand: string;

  @Prop({
    required: [true, 'please provide valid title of product'],
    type: String,
  })
  title: string;

  @Prop({
    required: [true, 'please provide valid price of product'],
    type: Number,
  })
  price: number;

  // original price, off , tag , state property is optional
  @Prop({ required: false, type: String })
  original_price: string;

  @Prop({ required: false, type: String })
  off: string;

  @Prop({ required: false, type: String })
  tag: string;

  @Prop({ required: false, type: String })
  state: string;
}
// Create a Mongoose schema from the Product class
export const ProductSchema = SchemaFactory.createForClass(Product);

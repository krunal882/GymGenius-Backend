import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({
    required: [true, 'please provide category of the product'],
    type: String,
  })
  category: string;

  @Prop({
    required: false,
    type: String,
  })
  src: string;

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

  @Prop({ required: false, type: String })
  original_price: string;

  @Prop({ required: false, type: String })
  off: string;

  @Prop({ required: false, type: String })
  tag: string;

  @Prop({ required: false, type: String })
  state: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: [true, 'please provide category of the product'] })
  category: string;

  @Prop({ required: [true, 'please provide valid source image'] })
  src: string;

  @Prop({ required: [true, 'please provide valid brand name of product'] })
  brand: string;

  @Prop({ required: [true, 'please provide valid title of product'] })
  title: string;

  @Prop({ required: [true, 'please provide valid price of product'] })
  price: string;

  @Prop({ required: [false] })
  original_price: string;

  @Prop({ required: [false] })
  off: string;

  @Prop({ required: [false] })
  tag: string;

  @Prop({ required: [false] })
  state: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

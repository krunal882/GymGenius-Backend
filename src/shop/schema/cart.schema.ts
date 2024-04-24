import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop({ required: [true, 'please provide id of the product'] })
  productId: string;
}

export const CartSchema = SchemaFactory.createForClass(History);

// Import necessary decorators and classes from @nestjs/mongoose and mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop({ required: [true, 'please provide id of the user'] })
  userId: string;

  // a product property as an array with validation to ensure it is required
  @Prop({ required: [true, 'please provide detail of the product'] })
  product: {
    productId: string;
    status: string;
    paymentId?: string;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(History);

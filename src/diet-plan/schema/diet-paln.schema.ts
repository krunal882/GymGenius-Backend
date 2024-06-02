import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Import necessary decorators and utilities from '@nestjs/mongoose'
import { Document } from 'mongoose';

@Schema()
export class DietPlan extends Document {
  @Prop({
    required: [true, 'Please provide plan name'],
    type: String,
  })
  plan_name: string;

  @Prop({ required: [true, 'Please provide diet type'], type: String })
  diet_type: string;

  @Prop({ required: [true, 'Please provide purpose of diet'], type: String })
  purpose: string;

  @Prop({
    required: [true, 'Please provide total number of days'],
    type: String,
  })
  total_days: string;

  @Prop({ required: [true, 'Please provide meals'], type: Array })
  meals: {
    day: string;
    meal_type: string;
    foods: {
      name: string;
      quantity: string;
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber: number;
    }[];
  }[];

  @Prop({ required: [true, 'Please provide image of diet'], type: String })
  cloudImg: string;
}

// Create the schema using SchemaFactory
export const DietPlanSchema = SchemaFactory.createForClass(DietPlan);

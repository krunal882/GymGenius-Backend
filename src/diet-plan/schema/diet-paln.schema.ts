import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DietPlan extends Document {
  @Prop({
    required: [true, 'Please provide plan name'],
  })
  plan_name: string;

  @Prop({ required: [true, 'Please provide diet type'] })
  diet_type: string;

  @Prop({ required: [true, 'Please provide purpose of diet'] })
  purpose: string;

  @Prop({ required: [true, 'Please provide total number of days'] })
  total_days: number;

  @Prop({ required: [true, 'Please provide meals'] })
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
}

export const DietPlanSchema = SchemaFactory.createForClass(DietPlan);

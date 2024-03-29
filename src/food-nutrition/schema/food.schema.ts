import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FoodNutrition extends Document {
  @Prop({
    required: [true, 'please provide valid food item name'],
  })
  name: string;

  @Prop({ required: [true, 'please provide image of food item '] })
  image: string;

  @Prop({ required: [true, 'please provide food item category'] })
  category: string;

  @Prop({ required: [true, 'please provide health benefits of food items'] })
  health_benefits: string[];

  @Prop({
    required: [true, 'please provide nutritional value of food items'],
    type: Map,
    of: Number,
  })
  nutritions: Map<string, number>;

  @Prop({ required: [true, 'please provide culinary uses of food items'] })
  culinary_uses: string[];

  @Prop({ required: [true, 'please provide varieties of food items'] })
  varieties: string[];

  @Prop({ required: [true, 'please provide fun facts of food items'] })
  fun_facts_and_trivia: string[];

  @Prop({ required: [true, 'please provide recipes of food items'] })
  recipes_and_serving_ideas: {
    name: string;
    ingredients: string[];
    instructions: string[];
  }[];
}

export const FoodSchema = SchemaFactory.createForClass(FoodNutrition);

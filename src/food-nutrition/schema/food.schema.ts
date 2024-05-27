import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FoodNutrition extends Document {
  @Prop({
    required: [true, 'please provide valid food item name'],
    type: String,
  })
  name: string;

  @Prop({
    required: false,
    type: String,
  })
  image: string;

  @Prop({
    required: false,
    type: String,
  })
  cloudImg: string;

  @Prop({ required: [true, 'please provide food item category'], type: String })
  category: string;

  @Prop({
    required: [true, 'please provide health benefits of food items'],
    type: [String],
  })
  health_benefits: string[];

  @Prop({
    required: [true, 'please provide nutritional value of food items'],
    type: Map,
    of: Number,
  })
  nutritions: Map<string, number>;

  @Prop({
    required: [true, 'please provide culinary uses of food items'],
    type: [String],
  })
  culinary_uses: string[];

  @Prop({
    required: [true, 'please provide varieties of food items'],
    type: [String],
  })
  varieties: string[];

  @Prop({
    required: [true, 'please provide fun facts of food items'],
    type: [String],
  })
  fun_facts_and_trivia: string[];

  @Prop({ required: [true, 'please provide recipes of food items'] })
  recipes_and_serving_ideas: {
    name: string;
    ingredients: string[];
    instructions: string[];
  }[];
}

export const FoodSchema = SchemaFactory.createForClass(FoodNutrition);

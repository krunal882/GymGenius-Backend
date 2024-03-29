import { Module } from '@nestjs/common';
import { FoodNutritionController } from './food-nutrition.controller';
import { FoodNutritionService } from './food-nutrition.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodSchema } from './schema/food.schema';

@Module({
  controllers: [FoodNutritionController],
  providers: [FoodNutritionService],
  imports: [
    MongooseModule.forFeature([{ name: 'FoodNutrition', schema: FoodSchema }]),
  ],
})
export class FoodNutritionModule {}

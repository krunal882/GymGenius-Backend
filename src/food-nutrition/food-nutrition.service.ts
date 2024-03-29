import { Injectable } from '@nestjs/common';
import { FoodNutrition } from './schema/food.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class FoodNutritionService {
  constructor(
    @InjectModel(FoodNutrition.name)
    private food: mongoose.Model<FoodNutrition>,
  ) {}

  async getAllFood(): Promise<FoodNutrition[]> {
    const food = await this.food.find();
    return food;
  }
  async getFilteredFood(queryParams: any): Promise<FoodNutrition[]> {
    const filter: any = {};

    const filterableKeys = ['category', 'name'];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
      }
    });

    const Food = await this.food.find(filter);
    return Food;
  }
}

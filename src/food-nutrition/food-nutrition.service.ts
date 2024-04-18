import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FoodNutrition } from './schema/food.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { foodNutritionDto } from './dto/food-nutrition.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateFoodDto } from './dto/food-update.dto';

@Injectable()
export class FoodNutritionService {
  constructor(
    @InjectModel(FoodNutrition.name)
    private foodModel: mongoose.Model<FoodNutrition>,
  ) {}

  async getAllFood(limit?: number): Promise<FoodNutrition[]> {
    let food = this.foodModel.find();
    if (limit) {
      food = food.limit(limit);
    }
    return food.exec();
  }
  async getFilteredFood(queryParams: any): Promise<FoodNutrition[]> {
    const filter: any = {};

    const filterableKeys = ['category', 'name', 'calories', 'protein'];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
      }
    });

    if (queryParams.calories_min || queryParams.calories_max) {
      const minCalories = queryParams.calories_min;
      const maxCalories = queryParams.calories_max;

      if (minCalories && maxCalories) {
        filter['nutritions.calories'] = {
          $gte: minCalories,
          $lte: maxCalories,
        };
      } else if (minCalories) {
        filter['nutritions.calories'] = { $gte: minCalories };
      } else if (maxCalories) {
        filter['nutritions.calories'] = { $lte: maxCalories };
      }
    }

    if (queryParams.protein_min || queryParams.protein_max) {
      const minProtein = queryParams.protein_min;
      const maxProtein = queryParams.protein_max;

      if (minProtein && maxProtein) {
        filter['nutritions.protein'] = {
          $gte: minProtein,
          $lte: maxProtein,
        };
      } else if (maxProtein) {
        filter['nutritions.protein'] = { $gte: maxProtein };
      } else if (minProtein) {
        filter['nutritions.protein'] = { $lte: minProtein };
      }
    }
    const Food = await this.foodModel.find(filter);
    return Food;
  }

  async addFoodItem(foodNutritionDto: foodNutritionDto): Promise<string> {
    try {
      await createOne(this.foodModel, foodNutritionDto);
      return 'Successfully added foodItem';
    } catch (error) {
      throw new BadRequestException('Error while creating exercise');
    }
  }

  async deleteFoodItem(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      await deleteOne(this.foodModel, id);
      return 'Successfully deleted food item';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('food item not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateFoodItem(
    id: mongoose.Types.ObjectId,
    updateData: updateFoodDto,
  ): Promise<FoodNutrition> {
    return await updateOne(this.foodModel, id, updateData);
  }
}

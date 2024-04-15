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

  async getAllFood(): Promise<FoodNutrition[]> {
    const food = await this.foodModel.find();
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

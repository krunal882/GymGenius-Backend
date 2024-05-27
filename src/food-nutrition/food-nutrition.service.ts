import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { FoodNutrition } from './schema/food.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { foodNutritionDto } from './dto/food-nutrition.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateFoodDto } from './dto/food-update.dto';

interface nutrition {
  category?: string;
  name?: string;
  calories?: number;
  protein?: number;
  _id?: string;
  nutritions?: {
    calories?: number;
    protein?: number;
  };
}

interface QueryParams {
  category?: string;
  name?: string;
  calories?: number;
  protein?: number;
  _id?: string;
  calories_min?: number;
  calories_max?: number;
  protein_min?: number;
  protein_max?: number;
  limit?: number;
  page?: number;
}

type FoodFilter = Partial<Omit<nutrition, 'name' | 'nutritions'>> & {
  name?: string | { $regex: RegExp };
  'nutritions.calories'?: {
    $gte?: number;
    $lte?: number;
  };
  'nutritions.protein'?: {
    $gte?: number;
    $lte?: number;
  };
};

@Injectable()
export class FoodNutritionService {
  constructor(
    @InjectModel(FoodNutrition.name)
    private foodModel: mongoose.Model<FoodNutrition>,
  ) {}

  async getAllFood(limit: number, page: number): Promise<FoodNutrition[]> {
    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const skip = (page - 1) * limit;

    const food = await this.foodModel.find().skip(skip).limit(limit).exec();
    return food;
  }
  async getFilteredFood(queryParams: QueryParams): Promise<FoodNutrition[]> {
    if (queryParams.limit <= 0 || queryParams.page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const filter: FoodFilter = {};

    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;
    const skip = (page - 1) * limit;

    const filterableKeys = ['category', 'name', 'calories', 'protein', '_id'];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        if (key === 'name') {
          filter[key] = { $regex: new RegExp(queryParams[key], 'i') };
        } else {
          filter[key] = queryParams[key];
        }
      }
    });
    ['calories', 'protein'].forEach((key) => {
      if (
        queryParams[`${key}_min`] !== undefined ||
        queryParams[`${key}_max`] !== undefined
      ) {
        filter[`nutritions.${key}`] = {};
        if (queryParams[`${key}_min`] !== undefined) {
          filter[`nutritions.${key}`].$gte = queryParams[`${key}_min`];
        }
        if (queryParams[`${key}_max`] !== undefined) {
          filter[`nutritions.${key}`].$lte = queryParams[`${key}_max`];
        }
      }
    });
    const Food = await this.foodModel.find(filter).skip(skip).limit(limit);
    return Food;
  }

  async addFoodItem(foodNutritionDto: foodNutritionDto): Promise<void> {
    await createOne(this.foodModel, foodNutritionDto);
  }

  async deleteFoodItem(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const objectId = new mongoose.Types.ObjectId(id);
    await deleteOne(this.foodModel, objectId);
  }

  async updateFoodItem(
    _id: mongoose.Types.ObjectId,
    updateData: updateFoodDto,
  ): Promise<FoodNutrition> {
    return await updateOne(this.foodModel, _id, updateData);
  }
}

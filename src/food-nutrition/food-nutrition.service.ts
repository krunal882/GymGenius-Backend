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

  async getAllFood(limit?: number): Promise<FoodNutrition[]> {
    let food = this.foodModel.find();
    if (limit) {
      food = food.limit(limit);
    }
    return food.exec();
  }
  async getFilteredFood(queryParams: QueryParams): Promise<FoodNutrition[]> {
    const filter: FoodFilter = {};

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
    if (
      queryParams.calories_min !== undefined ||
      queryParams.calories_max !== undefined
    ) {
      filter['nutritions.calories'] = {};
      if (queryParams.calories_min !== undefined) {
        filter['nutritions.calories'].$gte = queryParams.calories_min;
      }
      if (queryParams.calories_max !== undefined) {
        filter['nutritions.calories'].$lte = queryParams.calories_max;
      }
    }

    if (
      queryParams.protein_min !== undefined ||
      queryParams.protein_max !== undefined
    ) {
      filter['nutritions.protein'] = {};
      if (queryParams.protein_min !== undefined) {
        filter['nutritions.protein'].$gte = queryParams.protein_min;
      }
      if (queryParams.protein_max !== undefined) {
        filter['nutritions.protein'].$lte = queryParams.protein_max;
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
      throw new BadRequestException('Error while adding food-item');
    }
  }

  async deleteFoodItem(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      await deleteOne(this.foodModel, objectId);
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
    _id: mongoose.Types.ObjectId,
    updateData: updateFoodDto,
  ): Promise<FoodNutrition> {
    const data = await updateOne(this.foodModel, _id, updateData);
    return data;
  }
}

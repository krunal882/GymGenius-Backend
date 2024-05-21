import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FoodNutritionService } from './food-nutrition.service';
import { foodNutritionDto } from './dto/food-nutrition.dto';
import mongoose from 'mongoose';
import { updateFoodDto } from './dto/food-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('foodNutrition')
@UseGuards(AuthGuard)
export class FoodNutritionController {
  constructor(private readonly foodNutritionService: FoodNutritionService) {}

  @Get('/')
  async getAllFood(@Query('limit') limit: number, @Query('page') page: number) {
    const foodItem = await this.foodNutritionService.getAllFood(limit, page);
    return foodItem;
  }
  @Get('/filtered')
  async getFilteredFood(
    @Query('category') category: string,
    @Query('name') name: string,
    @Query('calories_min') calories_min: number,
    @Query('calories_max') calories_max: number,
    @Query('protein_min') protein_min: number,
    @Query('protein_max') protein_max: number,
    @Query('nutritionId') nutritionId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const queryParams = {
      category,
      name,
      calories_min,
      calories_max,
      protein_max,
      protein_min,
      _id: nutritionId,
      page,
      limit,
    };

    return await this.foodNutritionService.getFilteredFood(queryParams);
  }

  @Post('/addFoodItem')
  async addFoodItem(
    @Body() FoodNutritionDto: foodNutritionDto,
  ): Promise<string> {
    return this.foodNutritionService.addFoodItem(FoodNutritionDto);
  }

  @Delete('/deleteFoodItem')
  async deleteFoodItem(@Query('id') id: string): Promise<string> {
    await this.foodNutritionService.deleteFoodItem(id);
    return 'foodItem detail deleted successfully';
  }

  @Patch('/updateFoodItem')
  async updateDietPlan(
    @Query('id') _id: string,
    @Body() updateData: updateFoodDto,
  ): Promise<string> {
    await this.foodNutritionService.updateFoodItem(
      new mongoose.Types.ObjectId(_id),
      updateData,
    );
    return 'foodItem detail updated successfully';
  }
}

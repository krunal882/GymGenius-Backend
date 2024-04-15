import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  async getAllFood() {
    const user = await this.foodNutritionService.getAllFood();
    return user;
  }
  //food (category) = Dairy , Fruit , Grain , Vegetable
  @Get('/filtered')
  async getFilteredFood(
    @Param('category') category: string,
    @Param('name') name: string,
  ) {
    const queryParams = { category, name };

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
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateFoodDto,
  ): Promise<string> {
    await this.foodNutritionService.updateFoodItem(id, updateData);
    return 'foodItem detail updated successfully';
  }
}

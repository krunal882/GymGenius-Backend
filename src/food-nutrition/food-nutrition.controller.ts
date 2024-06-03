import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'; // Import decorators and utilities from NestJS
import { FoodNutritionService, QueryParams } from './food-nutrition.service'; // Import service and QueryParams interface
import { foodNutritionDto } from './dto/food-nutrition.dto';
import mongoose from 'mongoose';
import { updateFoodDto } from './dto/food-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FoodNutrition } from './schema/food.schema';

@Controller('foodNutrition') // Define controller base route
export class FoodNutritionController {
  constructor(private readonly foodNutritionService: FoodNutritionService) {} // Inject FoodNutritionService

  // Endpoint to get all food items with pagination
  @Get('/')
  async getAllFood(@Query('limit') limit: number, @Query('page') page: number) {
    return await this.foodNutritionService.getAllFood(limit, page);
  }
  // Endpoint to get filtered food items
  @Get('/filtered')
  async getFilteredFood(@Query() Query: QueryParams) {
    return await this.foodNutritionService.getFilteredFood(Query);
  }

  // Endpoint to add a new food item
  @UseGuards(AuthGuard) // Apply authentication guard to controller
  @Post('/addFoodItem')
  async addFoodItem(@Body() FoodNutritionDto: foodNutritionDto): Promise<void> {
    await this.foodNutritionService.addFoodItem(FoodNutritionDto);
  }

  // Endpoint to delete a food item
  @UseGuards(AuthGuard)
  @Delete('/deleteFoodItem')
  async deleteFoodItem(@Query('id') id: string): Promise<void> {
    await this.foodNutritionService.deleteFoodItem(id);
  }

  // Endpoint to update a food item
  @UseGuards(AuthGuard)
  @Patch('/updateFoodItem')
  async updateDietPlan(
    @Query('id') _id: string,
    @Body() updateData: updateFoodDto,
  ): Promise<FoodNutrition> {
    return await this.foodNutritionService.updateFoodItem(
      new mongoose.Types.ObjectId(_id),
      updateData,
    );
  }
}

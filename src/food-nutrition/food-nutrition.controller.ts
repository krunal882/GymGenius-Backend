import { Controller, Get, Param } from '@nestjs/common';
import { FoodNutritionService } from './food-nutrition.service';

@Controller('foodNutrition')
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
}

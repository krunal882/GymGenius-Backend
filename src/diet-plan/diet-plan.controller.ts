import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DietPlanService } from './diet-plan.service';
import { DietPlan } from './schema/diet-paln.schema';
import { dietPlanDto } from './dto/diet-plan.dto';
@Controller('diet-plans')
export class DietPlanController {
  constructor(private readonly dietPlanService: DietPlanService) {}

  @Get('/')
  async getAllDietPlans() {
    const dietPlans = await this.dietPlanService.getAllDietPlans();
    return dietPlans;
  }

  @Get('/filter')
  async getFilteredPlan(
    @Query('diet_type') dietType: string,
    @Query('purpose') purpose: string,
  ) {
    const queryParams = {
      diet_type: dietType,
      purpose: purpose,
    };
    return await this.dietPlanService.getFilteredPlan(queryParams);
  }

  @Post('/add')
  async createDietPlan(@Body() dietPlanDto: dietPlanDto): Promise<DietPlan> {
    return this.dietPlanService.createDietPlan(dietPlanDto);
  }

  @Delete('/delete')
  async deleteDietPlan(@Query('id') id: string): Promise<void> {
    this.dietPlanService.deleteDietPlan(id);
  }
}

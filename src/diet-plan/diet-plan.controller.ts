import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DietPlanService } from './diet-plan.service';
import mongoose from 'mongoose';
import { dietPlanDto } from './dto/diet-plan.dto';
import { updateDiet } from './dto/diet-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('diet-plans')
@UseGuards(AuthGuard)
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
  async createDietPlan(@Body() DietPlanDto: dietPlanDto): Promise<string> {
    return this.dietPlanService.createDietPlan(DietPlanDto);
  }

  @Delete('/delete')
  async deleteDietPlan(@Query('id') id: string): Promise<void> {
    this.dietPlanService.deleteDietPlan(id);
  }

  @Patch('/update')
  async updateDietPlan(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateDiet,
  ): Promise<string> {
    await this.dietPlanService.updateDietPlan(id, updateData);
    return 'diet plan updated successfully';
  }
}

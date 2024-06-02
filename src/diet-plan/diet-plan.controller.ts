import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'; // Import necessary decorators and utilities from '@nestjs/mongoose'
import { DietPlanService } from './diet-plan.service';
import mongoose from 'mongoose';
import { dietPlanDto } from './dto/diet-plan.dto';
import { updateDiet } from './dto/diet-update.dto';
import { AuthGuard } from 'src/auth/auth.guard'; // Import AuthGuard for authentication
import { DietPlan } from './schema/diet-paln.schema';
import { QueryParams } from './diet-plan.service'; // import interface from the service

@Controller('diet-plans')
@UseGuards(AuthGuard)
export class DietPlanController {
  constructor(private readonly dietPlanService: DietPlanService) {}

  //GET endpoint to get all diet plans
  @Get('/')
  async getAllDietPlans(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return await this.dietPlanService.getAllDietPlans(limit, page);
  }

  //GET endpoint to get filtered diet plans based on query parameters
  @Get('/filter')
  async getFilteredPlan(@Query() queryParams: QueryParams) {
    return await this.dietPlanService.getFilteredPlan(queryParams);
  }

  //POST endpoint  to add new diet plan
  @Post('/add')
  async createDietPlan(@Body() DietPlanDto: dietPlanDto): Promise<void> {
    await this.dietPlanService.createDietPlan(DietPlanDto);
  }

  // DELETE endpoint to remove diet plan
  @Delete('/delete')
  async deleteDietPlan(@Query('id') id: string): Promise<void> {
    await this.dietPlanService.deleteDietPlan(id);
  }

  //PATCH endpoint to update dietPlan
  @Patch('/update')
  async updateDietPlan(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateDiet,
  ): Promise<DietPlan> {
    return await this.dietPlanService.updateDietPlan(id, updateData);
  }
}

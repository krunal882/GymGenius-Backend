import { createOne, deleteOne, updateOne } from './../factoryFunction';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { DietPlan } from './schema/diet-paln.schema';
import { dietPlanDto } from './dto/diet-plan.dto';

@Injectable()
export class DietPlanService {
  constructor(
    @InjectModel(DietPlan.name)
    private dietPlanModel: mongoose.Model<DietPlan>,
  ) {}

  async getAllDietPlans(): Promise<DietPlan[]> {
    const dietPlan = await this.dietPlanModel.find();
    return dietPlan;
  }

  async getFilteredPlan(queryParams: any): Promise<DietPlan[]> {
    const filter: any = {}; // Initialize an empty filter object

    // Check if each query parameter exists and add it to the filter if present
    if (queryParams.diet_type) {
      filter.diet_type = queryParams.diet_type;
    }
    if (queryParams.purpose) {
      filter.purpose = queryParams.purpose;
    }

    // Execute the query with the constructed filter
    return await this.dietPlanModel.find(filter);
  }

  async createDietPlan(dietPlanDto: dietPlanDto): Promise<string> {
    try {
      await createOne(this.dietPlanModel, dietPlanDto);
      return 'Successfully created diet plan';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Status Failed!! Error while creating diet plan',
        );
      }
    }
  }

  async deleteDietPlan(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    try {
      await deleteOne(this.dietPlanModel, id);
      return 'Successfully deleted diet plan';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('Diet plan not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateDietPlan(
    id: mongoose.Types.ObjectId,
    updateData: any,
  ): Promise<DietPlan> {
    return await updateOne(this.dietPlanModel, id, updateData);
  }
}

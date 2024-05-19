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

interface Dietplan {
  diet_type?: string;
  purpose?: string;
  _id?: string;
  plan_name?: {};
}

interface QueryParams {
  diet_type?: string;
  purpose?: string;
  _id?: string;
  plan_name?: string;
}

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

  async getFilteredPlan(queryParams: QueryParams): Promise<DietPlan[]> {
    const filter: Dietplan = {};

    if (queryParams.diet_type) {
      filter.diet_type = queryParams.diet_type;
    }
    if (queryParams.purpose) {
      filter.purpose = queryParams.purpose;
    }
    if (queryParams._id) {
      filter._id = queryParams._id;
    }
    if (queryParams.plan_name) {
      filter.plan_name = { $regex: new RegExp(queryParams.plan_name, 'i') };
    }
    return await this.dietPlanModel.find(filter);
  }

  async createDietPlan(dietPlanDto: dietPlanDto): Promise<string> {
    try {
      console.log(dietPlanDto);
      await createOne(this.dietPlanModel, dietPlanDto);
      console.log('hi');
      return 'Successfully created diet plan';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Status Failed!! Error while creating diet plan',
        );
      }
    }
  }

  async deleteDietPlan(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const objectId = new mongoose.Types.ObjectId(id);
    try {
      await deleteOne(this.dietPlanModel, objectId);
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

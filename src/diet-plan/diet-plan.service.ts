// Import factory functions for CRUD operations
import { createOne, deleteOne, updateOne } from './../factoryFunction';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common'; // Import common exceptions and decorators
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { DietPlan } from './schema/diet-paln.schema';
import { dietPlanDto } from './dto/diet-plan.dto';

// Interface defining the structure of a Dietplan
interface Dietplan {
  diet_type?: string;
  purpose?: string;
  _id?: string;
  plan_name?: object;
}

// Interface defining the structure of query parameters
export interface QueryParams {
  category: string;
  purpose?: string;
  dietId?: string;
  name?: string;
  limit: number;
  page: number;
}

@Injectable()
export class DietPlanService {
  constructor(
    @InjectModel(DietPlan.name)
    private dietPlanModel: mongoose.Model<DietPlan>,
  ) {}

  // Method to retrieve all diet plans with pagination
  async getAllDietPlans(limit: number, page: number): Promise<DietPlan[]> {
    // Validate pagination parameters
    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }

    const skip = (page - 1) * limit;
    const dietPlan = await this.dietPlanModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return dietPlan;
  }

  // Method to retrieve filtered diet plans based on query parameters
  async getFilteredPlan(queryParams: QueryParams): Promise<DietPlan[]> {
    // Validate pagination parameters
    if (queryParams.limit <= 0 || queryParams.page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const filter: Dietplan = {};
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;
    const skip = (page - 1) * limit;

    // Construct filter based on query parameters
    if (queryParams.category) {
      filter.diet_type = queryParams.category;
    }
    if (queryParams.purpose) {
      filter.purpose = queryParams.purpose;
    }
    if (queryParams.dietId) {
      filter._id = queryParams.dietId;
    }
    if (queryParams.name) {
      filter.plan_name = { $regex: new RegExp(queryParams.name, 'i') };
    }
    // Retrieve filtered diet plans
    const dietPlans = await this.dietPlanModel
      .find(filter)
      .skip(skip)
      .limit(limit);
    return dietPlans;
  }

  // Method to create a new diet plan
  async createDietPlan(dietPlanDto: dietPlanDto): Promise<void> {
    await createOne(this.dietPlanModel, dietPlanDto);
  }

  // Method to delete a diet plan
  async deleteDietPlan(id: string): Promise<void> {
    // Validate if the provided ID is a valid ObjectId
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const objectId = new mongoose.Types.ObjectId(id);

    await deleteOne(this.dietPlanModel, objectId);
  }

  // Method to update a diet plan
  async updateDietPlan(
    id: mongoose.Types.ObjectId,
    updateData: any,
  ): Promise<DietPlan> {
    return await updateOne(this.dietPlanModel, id, updateData);
  }
}

import { Injectable } from '@nestjs/common';
import { YogaPose } from './schema/yoga.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class YogaService {
  constructor(
    @InjectModel(YogaPose.name) private yogaModel: mongoose.Model<YogaPose>,
  ) {}

  async getAllYogaPoses(): Promise<YogaPose[]> {
    const yoga = await this.yogaModel.find();
    return yoga;
  }

  async getFilteredYoga(queryParams: any): Promise<YogaPose[]> {
    const filter: any = {};

    if (queryParams.name) {
      // Use $or operator to search in both sanskrit_name and english_name fields
      filter.$or = [
        { sanskrit_name: { $regex: queryParams.name, $options: 'i' } },
        { english_name: { $regex: queryParams.name, $options: 'i' } },
      ];
    }

    if (queryParams.category_name) {
      filter.category_name = queryParams.category_name;
    }

    const yogaPoses = await this.yogaModel.find(filter).exec();
    return yogaPoses;
  }
}

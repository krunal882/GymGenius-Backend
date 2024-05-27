import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { YogaPose } from './schema/yoga.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { YogaPoseDto } from './dto/yoga-pose.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateYogaPoseDto } from './dto/yoga-update.dto';

interface YogaPoseFilter {
  name?: string;
  category_name?: string;
  _id?: string;
  limit: number;
  page: number;
}

@Injectable()
export class YogaService {
  constructor(
    @InjectModel(YogaPose.name) private yogaModel: mongoose.Model<YogaPose>,
  ) {}

  async getAllYogaPoses(limit: number, page: number): Promise<YogaPose[]> {
    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const skip = (page - 1) * limit;
    const yoga = await this.yogaModel.find().skip(skip).limit(limit).exec();
    return yoga;
  }

  async getFilteredYoga(queryParams: YogaPoseFilter): Promise<YogaPose[]> {
    const filter: any = {};
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;
    const skip = (page - 1) * limit;

    if (queryParams.name) {
      filter.$or = [
        { sanskrit_name_adapted: { $regex: queryParams.name, $options: 'i' } },
        { english_name: { $regex: queryParams.name, $options: 'i' } },
      ];
    }

    if (queryParams.category_name) {
      filter.category_name = queryParams.category_name;
    }

    if (queryParams._id) {
      filter._id = queryParams._id;
    }
    const yogaPoses = await this.yogaModel.find(filter).skip(skip).limit(limit);
    return yogaPoses;
  }

  async addYogaPose(yogaPoseDto: YogaPoseDto): Promise<YogaPose> {
    return await createOne(this.yogaModel, yogaPoseDto);
  }
  async deleteYogaPose(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    const existingYogaPose = await this.yogaModel.findById(id);
    if (!existingYogaPose) {
      throw new NotFoundException('Yoga pose not found');
    }
    const objectId = new mongoose.Types.ObjectId(id);
    await deleteOne(this.yogaModel, objectId);
  }

  async updateYogaPose(
    id: mongoose.Types.ObjectId,
    updateData: updateYogaPoseDto,
  ): Promise<YogaPose> {
    const existingYogaPose = await this.yogaModel.findById(id);
    if (!existingYogaPose) {
      throw new NotFoundException('Yoga pose not found');
    }
    return await updateOne(this.yogaModel, id, updateData);
  }
}

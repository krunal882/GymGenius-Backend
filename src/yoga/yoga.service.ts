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
}

@Injectable()
export class YogaService {
  constructor(
    @InjectModel(YogaPose.name) private yogaModel: mongoose.Model<YogaPose>,
  ) {}

  async getAllYogaPoses(limit?: number): Promise<YogaPose[]> {
    let query = this.yogaModel.find();
    if (limit) {
      query = query.limit(limit);
    }
    return query.exec();
  }

  async getFilteredYoga(queryParams: YogaPoseFilter): Promise<YogaPose[]> {
    const filter: any = {};
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
    const yogaPoses = await this.yogaModel.find(filter).exec();
    return yogaPoses;
  }

  async addYogaPose(yogaPoseDto: YogaPoseDto): Promise<string> {
    try {
      await createOne(this.yogaModel, yogaPoseDto);
      return 'Successfully added yoga-pose';
    } catch (error) {
      throw new BadRequestException('Error while creating yoga-pose');
    }
  }
  async deleteYogaPose(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      await deleteOne(this.yogaModel, objectId);
      return 'Successfully deleted yoga pose';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('yoga-pose not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateYogaPose(
    id: mongoose.Types.ObjectId,
    updateData: updateYogaPoseDto,
  ): Promise<YogaPose> {
    return await updateOne(this.yogaModel, id, updateData);
  }
}

import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './schema/exercise.schema';
import mongoose from 'mongoose';
import { exerciseDto } from './dto/exercise.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateExercise } from './dto/exercise-update.dto';

interface exercise {
  force?: string;
  level?: string;
  equipment?: string;
  primaryMuscles?: string;
  category?: string;
  mechanic?: string;
  name?: string;
  _id?: string;
}

interface QueryParams {
  force?: string;
  level?: string;
  equipment?: string;
  primaryMuscles?: string;
  category?: string;
  mechanic?: string;
  name?: string;
  _id?: string;
  limit: number;
  page: number;
}

type ExerciseFilter = Partial<Omit<exercise, 'name'>> & {
  name?: string | { $regex: RegExp };
};

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: mongoose.Model<Exercise>,
  ) {}

  async getAllExercises(limit: number, page: number): Promise<Exercise[]> {
    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }

    const skip = (page - 1) * limit;

    const exercises = await this.exerciseModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return exercises;
  }

  async getFilteredExercise(queryParams: QueryParams): Promise<Exercise[]> {
    const filter: ExerciseFilter = {};
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;

    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const skip = (page - 1) * limit;

    const filterableKeys = [
      'force',
      'level',
      'equipment',
      'primaryMuscles',
      'category',
      'mechanic',
      'name',
      '_id',
    ];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        if (key === 'name') {
          filter[key] = { $regex: new RegExp(queryParams[key], 'i') };
        } else {
          filter[key] = queryParams[key];
        }
      }
    });

    const exercises = await this.exerciseModel
      .find(filter)
      .skip(skip)
      .limit(limit);
    return exercises;
  }
  async createExercise(exerciseDto: exerciseDto): Promise<Exercise> {
    return await createOne(this.exerciseModel, exerciseDto);
  }

  async deleteExercise(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const objectId = new mongoose.Types.ObjectId(id);

    await deleteOne(this.exerciseModel, objectId);
  }

  async updateExercise(
    _id: mongoose.Types.ObjectId,
    updateData: updateExercise,
  ): Promise<Exercise> {
    const data = await updateOne(this.exerciseModel, _id, updateData);
    return data;
  }
}

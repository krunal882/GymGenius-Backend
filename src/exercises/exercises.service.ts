import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
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
}

type ExerciseFilter = Partial<Omit<exercise, 'name'>> & {
  name?: string | { $regex: RegExp };
};

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: mongoose.Model<Exercise>,
  ) {}

  async getAllExercises(limit?: number): Promise<Exercise[]> {
    let query = this.exerciseModel.find();
    if (limit) {
      query = query.limit(limit);
    }
    return query.exec();
  }

  async getFilteredExercise(queryParams: QueryParams): Promise<Exercise[]> {
    const filter: ExerciseFilter = {};

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

    const exercises = await this.exerciseModel.find(filter);
    return exercises;
  }
  async createExercise(exerciseDto: exerciseDto): Promise<string> {
    try {
      await createOne(this.exerciseModel, exerciseDto);
      return 'Successfully created exercise';
    } catch (error) {
      throw new BadRequestException('Error while creating exercise');
    }
  }

  async deleteExercise(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      await deleteOne(this.exerciseModel, objectId);
      return 'Successfully deleted exercise';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('exercise not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateExercise(
    _id: mongoose.Types.ObjectId,
    updateData: updateExercise,
  ): Promise<Exercise> {
    console.log(updateData);
    const data = await updateOne(this.exerciseModel, _id, updateData);
    return data;
  }
}

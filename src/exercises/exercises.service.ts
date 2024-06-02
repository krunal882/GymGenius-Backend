import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common'; // Import common exceptions and Injectable decorator
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './schema/exercise.schema';
import mongoose from 'mongoose';
import { exerciseDto } from './dto/exercise.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateExercise } from './dto/exercise-update.dto';

// Interface defining the structure of an exercise
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

// Interface defining the structure of query parameters
export interface QueryParams {
  exerciseId?: string;
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
    @InjectModel(Exercise.name) private exerciseModel: mongoose.Model<Exercise>, // Inject the Mongoose model for Exercise
  ) {}

  // Method to retrieve all exercises with pagination
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

  // Method to retrieve filtered exercises based on query parameters
  async getFilteredExercise(queryParams: QueryParams): Promise<Exercise[]> {
    const filter: ExerciseFilter = {};
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;

    if (limit <= 0 || page <= 0) {
      throw new BadRequestException('Limit and page must be positive numbers.');
    }
    const skip = (page - 1) * limit;

    const filterableKeys = [
      'exerciseId',
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
  // Method to create a new exercise
  async createExercise(exerciseDto: exerciseDto): Promise<Exercise> {
    return await createOne(this.exerciseModel, exerciseDto);
  }

  // Method to delete an exercise
  async deleteExercise(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }

    const objectId = new mongoose.Types.ObjectId(id);

    await deleteOne(this.exerciseModel, objectId);
  }

  // Method to update an exercise
  async updateExercise(
    _id: mongoose.Types.ObjectId,
    updateData: updateExercise,
  ): Promise<Exercise> {
    const data = await updateOne(this.exerciseModel, _id, updateData);
    return data;
  }
}

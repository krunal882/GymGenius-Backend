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

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: mongoose.Model<Exercise>,
  ) {}

  async getAllExercises(): Promise<Exercise[]> {
    const user = await this.exerciseModel.find();
    return user;
  }

  async getFilteredExercise(queryParams: any): Promise<Exercise[]> {
    const filter: any = {};

    const filterableKeys = [
      'force',
      'level',
      'equipment',
      'primaryMuscles',
      'category',
      'mechanic',
      'name',
    ];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
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

  async deleteExercise(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      await deleteOne(this.exerciseModel, id);
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
    id: mongoose.Types.ObjectId,
    updateData: updateExercise,
  ): Promise<Exercise> {
    return await updateOne(this.exerciseModel, id, updateData);
  }
}

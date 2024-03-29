import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './schema/exercise.schema';
import mongoose from 'mongoose';

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
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'; // Import decorators from NestJS
import { ExercisesService, QueryParams } from './exercises.service'; // Import service and QueryParams interface
import { exerciseDto } from './dto/exercise.dto';
import mongoose from 'mongoose';
import { updateExercise } from './dto/exercise-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Exercise } from './schema/exercise.schema';

@Controller('exercises')
@UseGuards(AuthGuard) // Use authentication guard for all routes in this controller
export class ExercisesController {
  constructor(private readonly exerciseService: ExercisesService) {} // Inject ExercisesService

  // GET endpoint to get all exercises
  @Get('/') // Define route to get all exercises
  async getAllExercises(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return await this.exerciseService.getAllExercises(limit, page); // Call service method to get all exercises
  }

  @Get('/filtered') // Define route to get filtered exercises
  async getFilteredExercise(@Query() Query: QueryParams) {
    return await this.exerciseService.getFilteredExercise(Query); // Call service method to get filtered exercises
  }

  @Post('/addExercise') // Define route to add an exercise
  async createExercise(@Body() ExerciseDto: exerciseDto): Promise<Exercise> {
    return await this.exerciseService.createExercise(ExerciseDto); // Call service method to create an exercise
  }

  @Delete('/deleteExercise') // Define route to delete an exercise
  async deleteExercise(@Query('id') id: string): Promise<void> {
    this.exerciseService.deleteExercise(id); // Call service method to delete an exercise
  }

  @Patch('/updateExercise') // Define route to update an exercise
  async updateDietPlan(
    @Query('id') _id: string,
    @Body() updateData: updateExercise,
  ): Promise<Exercise> {
    return await this.exerciseService.updateExercise(
      new mongoose.Types.ObjectId(_id), // Convert id string to mongoose ObjectId
      updateData,
    );
  }
}

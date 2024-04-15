import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { exerciseDto } from './dto/exercise.dto';
import mongoose from 'mongoose';
import { updateExercise } from './dto/exercise-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('exercises')
@UseGuards(AuthGuard)
export class ExercisesController {
  constructor(private readonly exerciseService: ExercisesService) {}

  @Get('/')
  async getAllExercises() {
    const user = await this.exerciseService.getAllExercises();
    return user;
  }

  @Get('/filtered')
  async getFilteredExercise(
    @Query('force') force: string,
    @Query('level') level: string,
    @Query('equipment') equipment: string,
    @Query('muscle') muscle: string,
    @Query('category') category: string,
    @Query('mechanic') mechanic: string,
    @Query('name') name: string,
  ) {
    const queryParams = {
      force,
      level,
      equipment,
      muscle,
      category,
      mechanic,
      name,
    };
    return await this.exerciseService.getFilteredExercise(queryParams);
  }

  @Post('/addExercise')
  async createExercise(@Body() ExerciseDto: exerciseDto): Promise<string> {
    await this.exerciseService.createExercise(ExerciseDto);
    return 'exercise added successfully';
  }

  @Delete('/deleteExercise')
  async deleteExercise(@Query('id') id: string): Promise<string> {
    this.exerciseService.deleteExercise(id);
    return 'exercise deleted successfully';
  }

  @Patch('/updateExercise')
  async updateDietPlan(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateExercise,
  ): Promise<string> {
    await this.exerciseService.updateExercise(id, updateData);
    return 'exercise updated successfully';
  }
}

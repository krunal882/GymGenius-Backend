import { Controller, Get, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exerciseService: ExercisesService) {}

  @Get('/')
  async getAllExercises() {
    const user = await this.exerciseService.getAllExercises();
    return user;
  }

  @Get('/filtered')
  async getFilteredPlan(
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
}

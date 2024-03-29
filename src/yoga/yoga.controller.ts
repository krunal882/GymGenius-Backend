import { Controller, Get, Query } from '@nestjs/common';
import { YogaService } from './yoga.service';

@Controller('yoga-poses')
export class YogaController {
  constructor(private readonly yogaService: YogaService) {}

  @Get('/')
  async getAllYogaPoses() {
    const yoga = await this.yogaService.getAllYogaPoses();
    return yoga;
  }

  @Get('/filtered')
  async getFilteredYoga(
    @Query('name') name: string,
    @Query('category_name') category_name: string,
  ) {
    const queryParams = {
      name,
      category_name,
    };

    return this.yogaService.getFilteredYoga(queryParams);
  }
}

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
import { YogaService } from './yoga.service';
import { YogaPoseDto } from './dto/yoga-pose.dto';
import mongoose from 'mongoose';
import { updateYogaPoseDto } from './dto/yoga-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { YogaPose } from './schema/yoga.schema';

@Controller('yoga-poses')
@UseGuards(AuthGuard)
export class YogaController {
  constructor(private readonly yogaService: YogaService) {}

  @Get('/')
  async getAllYogaPoses(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const yoga = await this.yogaService.getAllYogaPoses(limit, page);
    return yoga;
  }

  @Get('/filtered')
  async getFilteredYoga(
    @Query('name') name: string,
    @Query('category') category_name: string,
    @Query('yogaId') yogaId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const queryParams = {
      name,
      category_name,
      _id: yogaId,
      page,
      limit,
    };

    return await this.yogaService.getFilteredYoga(queryParams);
  }

  @Post('/addYoga')
  async addYogaPose(@Body() yogaPoseDto: YogaPoseDto): Promise<YogaPose> {
    return await this.yogaService.addYogaPose(yogaPoseDto);
  }

  @Delete('/deleteYoga')
  async deleteYogaPose(@Query('id') id: string): Promise<void> {
    await this.yogaService.deleteYogaPose(id);
  }

  @Patch('/updateYoga')
  async updateYogaPose(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateYogaPoseDto,
  ): Promise<string> {
    await this.yogaService.updateYogaPose(id, updateData);
    return 'yoga-pose updated successfully';
  }
}

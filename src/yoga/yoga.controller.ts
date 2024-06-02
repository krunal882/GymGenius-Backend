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
import { YogaService } from './yoga.service';
import { YogaPoseDto } from './dto/yoga-pose.dto';
import mongoose from 'mongoose';
import { updateYogaPoseDto } from './dto/yoga-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { YogaPose } from './schema/yoga.schema';
import { QueryParams } from 'src/exercises/exercises.service';

@Controller('yoga-poses')
@UseGuards(AuthGuard)
export class YogaController {
  constructor(private readonly yogaService: YogaService) {}

  // Endpoint for retrieving all yoga poses
  @Get('/')
  async getAllYogaPoses(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const yoga = await this.yogaService.getAllYogaPoses(limit, page);
    return yoga;
  }

  // Endpoint for filtering yoga poses
  @Get('/filtered')
  async getFilteredYoga(@Query() Query: QueryParams) {
    return await this.yogaService.getFilteredYoga(Query);
  }

  // Endpoint for adding a new yoga pose
  @Post('/addYoga')
  async addYogaPose(@Body() yogaPoseDto: YogaPoseDto): Promise<YogaPose> {
    return await this.yogaService.addYogaPose(yogaPoseDto);
  }

  // Endpoint for deleting a yoga pose
  @Delete('/deleteYoga')
  async deleteYogaPose(@Query('id') id: string): Promise<void> {
    await this.yogaService.deleteYogaPose(id);
  }

  // Endpoint for updating a yoga pose
  @Patch('/updateYoga')
  async updateYogaPose(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateYogaPoseDto,
  ): Promise<string> {
    await this.yogaService.updateYogaPose(id, updateData);
    return 'yoga-pose updated successfully';
  }
}

import { Module } from '@nestjs/common';
import { DietPlanController } from './diet-plan.controller';
import { DietPlanService } from './diet-plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DietPlanSchema } from './schema/diet-paln.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'DietPlan', schema: DietPlanSchema }]),
  ],
  controllers: [DietPlanController],
  providers: [DietPlanService],
})
export class DietPlanModule {}

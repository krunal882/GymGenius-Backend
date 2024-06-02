import { Module } from '@nestjs/common';
import { YogaController } from './yoga.controller';
import { YogaService } from './yoga.service';
import { MongooseModule } from '@nestjs/mongoose';
import { YogaPoseSchema } from '../yoga/schema/yoga.schema';
@Module({
  imports: [
    // Importing MongooseModule with YogaPoseSchema for database operations
    MongooseModule.forFeature([{ name: 'YogaPose', schema: YogaPoseSchema }]),
  ],
  controllers: [YogaController],
  providers: [YogaService],
})
export class YogaModule {}

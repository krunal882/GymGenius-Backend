// Import necessary modules and components from NestJS and other libraries
import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSchema } from './schema/product.schema';
import { CartSchema } from './schema/history.schema';
import { ShopService } from './shop.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      // Define Mongoose models for Product and History (Cart)
      { name: 'Product', schema: ProductSchema },
      { name: 'History', schema: CartSchema },
    ]),
  ],
})
export class ShopModule {}

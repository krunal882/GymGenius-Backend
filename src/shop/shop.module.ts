import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSchema } from './schema/product.schema';
import { CartSchema } from './schema/cart.schema';
import { ShopService } from './shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'History', schema: CartSchema },
    ]),
  ],
})
export class ShopModule {}

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
import { ShopService } from './shop.service';
import { ProductDto } from './dto/product.dto';
import mongoose from 'mongoose';
import { updateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('store')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('/')
  async getShowcaseProduct() {
    return await this.shopService.getShowcaseProduct();
  }

  @Get('/filtered')
  async getFilteredProduct(
    @Query('title') title: string,
    @Query('category') category: string,
    @Query('sortPriceLtoH') sortPriceLtoH: string,
    @Query('sortPriceHtoL') sortPriceHtoL: string,
    @Query('sortByOff') sortByOff: string,
  ) {
    const queryParams = {
      title,
      category,
      sortPriceLtoH,
      sortPriceHtoL,
      sortByOff,
    };
    return await this.shopService.getFilteredProduct(queryParams);
  }

  @Post('/addProduct')
  async addProduct(@Body() productDto: ProductDto): Promise<string> {
    await this.shopService.addProduct(productDto);
    return 'product added successfully';
  }
  @Delete('/removeProduct')
  async removeProduct(@Query('id') id: string): Promise<string> {
    this.shopService.removeProduct(id);
    return 'product removed successfully';
  }

  @Patch('/updateProduct')
  async updateDietPlan(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateProductDto,
  ): Promise<string> {
    await this.shopService.updateProduct(id, updateData);
    return 'product detail updated successfully';
  }
}

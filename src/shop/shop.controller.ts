import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { ProductDto } from './dto/product.dto';
import { cartDto } from './dto/cart.dto';
import mongoose from 'mongoose';
import { updateProductDto } from './dto/update-product.dto';
import { User } from 'src/auth/schema/user.schema';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('store')
// @UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('/')
  async getShowcaseProduct(@Query('limit') limit?: number) {
    return await this.shopService.getShowcaseProduct(limit);
  }

  @Get('/filtered')
  async getFilteredProduct(
    @Query('title') title: string,
    @Query('category') category: string,
    @Query('LowToHigh') LowToHigh: string,
    @Query('HighToLow') HighToLow: string,
    @Query('sortByOff') sortByOff: string,
    @Query('maxPrice') maxPrice: number,
    @Query('minPrice') minPrice: number,
    @Query('id') id: number,
  ) {
    const queryParams = {
      title,
      category,
      LowToHigh,
      HighToLow,
      sortByOff,
      maxPrice,
      minPrice,
      id,
    };
    return await this.shopService.getFilteredProduct(queryParams);
  }

  @Get('/cart')
  async getCartProduct(@Body() userId: object) {
    return await this.shopService.getCartProduct(userId);
  }

  @Get('/history')
  async getPurchaseHistory(@Body() cartDto: cartDto) {
    return await this.shopService.getPurchaseHistory(cartDto);
  }

  @Post('/addProduct')
  async addProduct(@Body() productDto: ProductDto): Promise<string> {
    await this.shopService.addProduct(productDto);
    return 'product added successfully';
  }

  @Post('/addToCart')
  async addCartProduct(@Body() cartDto: cartDto): Promise<string> {
    await this.shopService.addCartProduct(cartDto);
    return 'product added to cart successfully';
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
  @Patch('/purchase')
  async purchaseProduct(@Body() productDto: ProductDto, user: User) {
    const purchaseMessage = await this.shopService.productPurchase(
      user,
      productDto,
    );
    return { message: purchaseMessage };
  }
}

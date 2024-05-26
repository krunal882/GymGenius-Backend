import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { ProductDto } from './dto/product.dto';
import mongoose from 'mongoose';
import { updateProductDto } from './dto/update-product.dto';
import { cartDto } from './dto/cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Controller('store')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('/')
  async getShowcaseProduct(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return await this.shopService.getShowcaseProduct(limit, page);
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
    @Query('id') id: string,
    @Query('name') name: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
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
      name,
      limit,
      page,
    };
    return await this.shopService.getFilteredProduct(queryParams);
  }

  @Get('/cart')
  async getCartProduct(@Query('userId') userId: string) {
    return await this.shopService.getCartProduct(userId);
  }

  @Get('/orders')
  async getAllOrders() {
    return await this.shopService.getAllOrders();
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

  @Delete('/removeCart')
  async removeCart(
    @Body() data: { userId: string; productId: string },
  ): Promise<string> {
    const { userId, productId } = data;
    this.shopService.removeCart(userId, productId);
    return 'product removed from cart successfully';
  }
  @Patch('/updateCart')
  async updateCart(
    @Body() data: { userId: string; productId: string[] },
  ): Promise<string> {
    try {
      const { userId, productId } = data;
      await this.shopService.updateCart(userId, productId);
      return 'Product status updated successfully';
    } catch (error) {
      throw new BadRequestException('Failed to update product status');
    }
  }

  @Delete('/removeProduct')
  async removeProduct(@Query('id') id: string): Promise<string> {
    this.shopService.removeProduct(id);
    return 'product removed successfully';
  }

  @Patch('/updateProduct')
  async updateProduct(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateProductDto,
  ): Promise<string> {
    await this.shopService.updateProduct(id, updateData);
    return 'product detail updated successfully';
  }
  @Patch('/purchase')
  async purchaseProduct(
    @Body()
    data: {
      price: number;
      quantity: string;
      title: string;
      email: string;
      userId: string;
      productId: string[];
    },
  ) {
    const { price, quantity, title, email, userId, productId } = data;

    const purchaseMessage = await this.shopService.productPurchase(
      price,
      quantity,
      title,
      email,
      userId,
      productId,
    );
    return { message: purchaseMessage };
  }

  @Post('webhook')
  webhook(@Body() event: any, @Res() response: Response) {
    try {
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    this.shopService.handleStripeWebhook(event);

    response.send();
  }

  @Patch('/refund')
  async refund(@Body() paymentIdObj: { [key: string]: string }) {
    const paymentId = Object.keys(paymentIdObj)[0];
    return await this.shopService.refundPayment(paymentId);
  }
}

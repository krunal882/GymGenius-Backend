// Import necessary decorators, modules, and classes from NestJS and other libraries
import {
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
import { QueryParams, ShopService } from './shop.service';
import { ProductDto } from './dto/product.dto';
import mongoose from 'mongoose';
import { updateProductDto } from './dto/update-product.dto';
import { cartDto } from './dto/cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

//  controller for the store, handling various endpoints related to shop operations
@Controller('store')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  // Endpoint to get filtered products based on query parameters
  @Get('/filtered')
  async getFilteredProduct(@Query() Query: QueryParams) {
    return await this.shopService.getFilteredProduct(Query);
  }

  // Endpoint to get cart products for a specific user
  @UseGuards(AuthGuard)
  @Get('/cart')
  async getCartProduct(@Query('userId') userId: string) {
    return await this.shopService.getCartProduct(userId);
  }

  // Endpoint to get all orders
  @UseGuards(AuthGuard)
  @Get('/orders')
  async getAllOrders() {
    return await this.shopService.getAllOrders();
  }

  // Endpoint to add a new product
  @UseGuards(AuthGuard)
  @Post('/addProduct')
  async addProduct(@Body() productDto: ProductDto): Promise<string> {
    await this.shopService.addProduct(productDto);
    return 'product added successfully';
  }

  // Endpoint to add a product to the cart
  @UseGuards(AuthGuard)
  @Post('/addToCart')
  async addCartProduct(@Body() cartDto: cartDto): Promise<string> {
    await this.shopService.addCartProduct(cartDto);
    return 'product added to cart successfully';
  }

  // Endpoint to remove a product from the cart
  @UseGuards(AuthGuard)
  @Delete('/removeCart')
  async removeCart(
    @Body() data: { userId: string; productId: string },
  ): Promise<string> {
    const { userId, productId } = data;
    return await this.shopService.removeCart(userId, productId);
  }

  // Endpoint to remove a product from the store
  @UseGuards(AuthGuard)
  @Delete('/removeProduct')
  async removeProduct(@Query('id') id: string): Promise<string> {
    this.shopService.removeProduct(id);
    return 'product removed successfully';
  }

  // Endpoint to update product details
  @UseGuards(AuthGuard)
  @Patch('/updateProduct')
  async updateProduct(
    @Query('id') id: mongoose.Types.ObjectId,
    @Body() updateData: updateProductDto,
  ): Promise<string> {
    await this.shopService.updateProduct(id, updateData);
    return 'product detail updated successfully';
  }
  // Endpoint to purchase a product
  @UseGuards(AuthGuard)
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

  // Endpoint to handle webhook events
  @Post('webhook')
  async webhook(@Body() event: any, @Res() response: Response) {
    await this.shopService.handleStripeWebhook(event);
    response.send();
  }

  // Endpoint to process a refund
  @UseGuards(AuthGuard)
  @Patch('/refund')
  async refund(@Body() paymentIdObj: { [key: string]: string }) {
    const paymentId = Object.keys(paymentIdObj)[0];
    return await this.shopService.refundPayment(paymentId);
  }
}

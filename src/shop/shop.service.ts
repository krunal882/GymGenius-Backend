import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { History } from './schema/history.schema';
import mongoose from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { cartDto } from './dto/cart.dto';
import { createOne, deleteOne } from 'src/factoryFunction';
import { updateProductDto } from './dto/update-product.dto';
import { AuthService } from './../auth/auth.service';
import Stripe from 'stripe';

interface QueryParams {
  title?: string;
  category?: string;
  id?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  HighToLow?: string;
  LowToHigh?: string;
  sortByOff?: string;
  limit?: number;
  page?: number;
}

type productFilter = Partial<{
  title: {};
  category: string;
  _id: string;
  price: {
    $gte?: number;
    $lte?: number;
  };
}>;

@Injectable()
export class ShopService {
  private stripe;
  constructor(
    @InjectModel('Product') private productModel: mongoose.Model<Product>,
    @InjectModel('History') private historyModel: mongoose.Model<History>,
    private authService: AuthService,
  ) {
    this.stripe = new Stripe(
      'sk_test_51Os07pSDcQHlNOyRkUjAGezWu07HqKIcKkrgWlBqiLvr7b1d1WjYV81nbS9Mnc43GBmtWFe9W13Om1qfWr1CxpYp00qUTDJ0bi',
    );
  }

  async getShowcaseProduct(limit: number, page: number): Promise<Product[]> {
    const categories = await this.productModel.distinct('category');

    const showcaseProducts: Product[] = [];

    for (const category of categories) {
      let products;
      if (limit) {
        const skip: number = page ? (page - 1) * limit : 0;
        products = await this.productModel
          .find({
            category,
            state: 'active',
          })
          .skip(skip)
          .limit(limit);
      } else {
        products = await this.productModel.find({
          category,
          state: 'active',
        });
      }
      showcaseProducts.push(...products);
    }

    return showcaseProducts;
  }

  async getCartProduct(userId: string): Promise<History[]> {
    try {
      const cartProducts = await this.historyModel.find({ userId }).exec();

      if (!cartProducts || cartProducts.length === 0) {
        return [];
      }

      return cartProducts;
    } catch (error) {
      console.error('Error while fetching cart products:', error);
      throw new Error('Error while fetching cart products');
    }
  }

  async getFilteredProduct(queryParams: QueryParams): Promise<Product[]> {
    try {
      const filter: productFilter = {};

      if (queryParams.title) {
        filter.title = queryParams.title;
      }
      if (queryParams.category) {
        filter.category = queryParams.category;
      }
      if (queryParams.id) {
        filter._id = queryParams.id;
      }
      if (queryParams.name) {
        filter.title = {
          $regex: new RegExp(queryParams.name, 'i'),
        };
      }

      if (
        queryParams.minPrice !== undefined ||
        queryParams.maxPrice !== undefined
      ) {
        filter['price'] = {};
        if (queryParams.minPrice !== undefined) {
          filter['price'].$gte = queryParams.minPrice;
        }
        if (queryParams.maxPrice !== undefined) {
          filter['price'].$lte = queryParams.maxPrice;
        }
      }

      const query = this.productModel.find({
        ...filter,
        state: 'active',
      });

      if (queryParams.limit) {
        query.limit(queryParams.limit);
      }

      if (queryParams.page) {
        const skip = (queryParams.page - 1) * queryParams.limit;
        query.skip(skip);
      }

      let products = await query.exec();
      if (queryParams.HighToLow !== undefined) {
        products = products.sort(
          (a: any, b: any) => parseInt(b.price) - parseInt(a.price),
        );
      } else if (queryParams.LowToHigh !== undefined) {
        products = products.sort(
          (a: any, b: any) => parseInt(a.price) - parseInt(b.price),
        );
      } else if (queryParams.sortByOff !== undefined) {
        products = products.sort(
          (a: any, b: any) => parseInt(b.off.trim()) - parseInt(a.off.trim()),
        );
      }

      return products;
    } catch (error) {
      console.error('Error while fetching filtered products:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<any[]> {
    const orders = await this.historyModel.find();

    const pendingProducts: { userId: string; productId: string }[] = [];

    orders.forEach((order) => {
      order.product.forEach((product) => {
        if (product.status === 'done') {
          pendingProducts.push({
            userId: order.userId,
            productId: product.productId,
          });
        }
      });
    });

    const uniqueUserIds = Array.from(
      new Set(pendingProducts.map((prod) => prod.userId)),
    );
    const promises = uniqueUserIds.map(async (userId) => {
      const user = await this.authService.getFilteredUser({ id: userId });

      const userPendingProducts = pendingProducts.filter(
        (prod) => prod.userId === userId,
      );

      const productPromises = userPendingProducts.map(async (prod) => {
        const productInfo = await this.getFilteredProduct({
          id: prod.productId,
        });
        return { userId, productInfo };
      });

      const productData = await Promise.all(productPromises);

      return { user, productData };
    });

    const data = await Promise.all(promises);

    return data;
  }
  async addProduct(productDto: ProductDto): Promise<string> {
    try {
      const existingProduct = await this.productModel.findOne({
        title: productDto.title,
      });
      if (existingProduct) {
        throw new BadRequestException(
          'Product with the same title already exists',
        );
      }

      await createOne(this.productModel, productDto);

      return 'Successfully added product';
    } catch (error) {
      console.error('Error while adding product:', error);
      throw new BadRequestException('Error while adding product');
    }
  }

  async addCartProduct(cartDto: cartDto): Promise<string> {
    try {
      const existingCart = await this.historyModel.findOne({
        userId: cartDto.userId,
      });

      if (existingCart) {
        existingCart.product = [...cartDto.product];
        await existingCart.save();
      } else {
        const cart = await createOne(this.historyModel, {
          userId: cartDto.userId,
          product: cartDto.product,
        });
        await cart.save();
      }
      return 'Successfully added product to cart';
    } catch (error) {
      throw new BadRequestException('Error while adding product');
    }
  }

  async removeCart(userId: string, productId: string): Promise<string> {
    try {
      const cart = await this.historyModel.findOne({ userId });

      if (!cart) {
        throw new NotFoundException('product not found in cart');
      }
      const productIndex = cart.product.findIndex(
        (product) => product.productId === productId,
      );
      if (productIndex === -1) {
        return 'product not found in cart';
      }

      cart.product.splice(productIndex, 1);

      await cart.save();

      return 'Successfully removed product from cart';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Error while removing product from cart');
      }
    }
  }
  async updateCart(
    userId: string,
    productId: string | string[],
    paymentId?: string,
  ): Promise<string> {
    try {
      const productIds = Array.isArray(productId) ? productId : [productId];

      for (const id of productIds) {
        const filter = {
          userId,
          'product.productId': id,
        };
        const update = { $set: { 'product.$.status': 'done' } };
        if (paymentId) {
          update.$set['product.$.paymentId'] = paymentId;
        }
        const result = await this.historyModel.updateOne(filter, update);

        if (result.matchedCount === 0) {
          throw new NotFoundException(
            `Product with ID ${id} not found in cart`,
          );
        }
      }

      return 'Successfully updated product status in cart';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException(
          'Error while updating product status in cart',
        );
      }
    }
  }

  async removeProduct(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      await deleteOne(this.productModel, objectId);
      return 'Successfully removed product';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('product not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateProduct(
    id: mongoose.Types.ObjectId,
    updateData: updateProductDto,
  ): Promise<Product> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );

      if (!updatedProduct) {
        throw new BadRequestException('Product not found');
      }

      return updatedProduct;
    } catch (error) {
      console.error('Error while updating product:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  async productPurchase(
    price: number,
    quantity: string,
    title: string,
    email: string,
    userId: string,
    productId: string[],
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `http://localhost:8081/profile/purchase`,
      cancel_url: `http://localhost:8081/store`,
      customer_email: email,
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: title,
              description: `you are purchasing the  product`,
              metadata: {
                totalQuantity: quantity,
              },
            },
            unit_amount: price * 100,
          },

          quantity: 1,
        },
      ],
      metadata: {
        totalQuantity: quantity,
        userId: userId,
        productId: productId.join(','),
      },
    });
    return session;
  }
  async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        let { productId } = session.metadata;
        const { userId } = session.metadata;
        const paymentId = session.payment_intent as string;
        try {
          if (typeof productId === 'string') {
            productId = productId.split(',');
          }
          await this.updateCart(userId, productId, paymentId);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
        break;
    }
  }
  async refundPayment(paymentId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: 'pi_3PKL88SDcQHlNOyR0JcHQNXo',
      });
      return refund;
    } catch (error) {
      throw new InternalServerErrorException('Refund failed: ' + error.message);
    }
  }
}

import {
  BadRequestException,
  Injectable,
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

  async getCartProduct(userId: string): Promise<History[]> {
    const cartProducts = await this.historyModel.find({ userId });
    if (!cartProducts || cartProducts.length === 0) {
      return [];
    }

    return cartProducts;
  }

  async getFilteredProduct(queryParams: QueryParams): Promise<Product[]> {
    const filter: any = { state: 'active' };

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
      filter.title = { $regex: new RegExp(queryParams.name, 'i') };
    }

    if (
      queryParams.minPrice !== undefined ||
      queryParams.maxPrice !== undefined
    ) {
      filter.price = {};
      if (queryParams.minPrice !== undefined) {
        filter.price.$gte = queryParams.minPrice;
      }
      if (queryParams.maxPrice !== undefined) {
        filter.price.$lte = queryParams.maxPrice;
      }
    }

    const query = this.productModel.find(filter);

    if (queryParams.limit) {
      query.limit(queryParams.limit);
    }

    if (queryParams.page) {
      const skip = (queryParams.page - 1) * queryParams.limit;
      query.skip(skip);
    }

    if (queryParams.HighToLow) {
      query.sort({ price: -1 });
    } else if (queryParams.LowToHigh) {
      query.sort({ price: 1 });
    } else if (queryParams.sortByOff) {
      query.sort({ off: -1 });
    }

    const products = await query.exec();
    return products;
  }

  async getAllOrders(): Promise<any[]> {
    const orders = await this.historyModel.find();
    if (orders.length === 0) {
      return [];
    }
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
      const user = await this.authService.getFilteredUser({ _id: userId });

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
  }

  async addCartProduct(cartDto: cartDto): Promise<string> {
    const existingCart = await this.historyModel.findOne({
      userId: cartDto.userId,
    });

    if (existingCart) {
      existingCart.product.push(...cartDto.product);
      await existingCart.save();
    } else {
      const cart = await createOne(this.historyModel, {
        userId: cartDto.userId,
        product: cartDto.product,
      });
      await cart.save();
    }
    return 'Successfully added product to cart';
  }

  async removeCart(userId: string, productId: string): Promise<string> {
    if (!userId || !productId) {
      throw new BadRequestException('Invalid input parameters');
    }

    const cart = await this.historyModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('product not found in cart');
    }
    const productIndex = cart.product.findIndex(
      (product) => product.productId === productId,
    );
    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    cart.product.splice(productIndex, 1);

    await cart.save();

    return 'Successfully removed product from cart';
  }
  async updateCart(
    userId: string,
    productId: string | string[],
    paymentId?: string,
  ): Promise<string> {
    if (!userId || !productId) {
      throw new BadRequestException('Invalid input parameters');
    }
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
        throw new NotFoundException(`Product with ID ${id} not found in cart`);
      }
    }

    return 'Successfully updated product status in cart';
  }

  async removeProduct(id: string): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    const objectId = new mongoose.Types.ObjectId(id);
    await deleteOne(this.productModel, objectId);
    return 'Successfully removed product';
  }

  async updateProduct(
    id: mongoose.Types.ObjectId,
    updateData: updateProductDto,
  ): Promise<Product> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      throw new BadRequestException('Product not found');
    }

    return updatedProduct;
  }

  async productPurchase(
    price: number,
    quantity: string,
    title: string,
    email: string,
    userId: string,
    productId: string[],
  ) {
    if (
      !price ||
      price <= 0 ||
      !quantity ||
      parseInt(quantity) <= 0 ||
      !title ||
      !email ||
      !userId ||
      !productId ||
      productId.length === 0
    ) {
      throw new BadRequestException('Invalid input parameters');
    }

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
    if (!event || !event.type) {
      throw new BadRequestException('Invalid webhook event');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        let { productId } = session.metadata;
        const { userId } = session.metadata;
        const paymentId = session.payment_intent as string;
        if (!productId || !userId || !paymentId) {
          throw new BadRequestException('Incomplete metadata in webhook event');
        }
        let productIds: string[];
        if (typeof productId === 'string') {
          productIds = productId.split(',');
        } else if (Array.isArray(productId)) {
          productIds = productId;
        } else {
          throw new BadRequestException('Invalid product ID format');
        }

        await this.updateCart(userId, productIds, paymentId);
        break;

      default:
        throw new BadRequestException('Unsupported event type');
    }
  }
  async refundPayment(paymentId: string): Promise<Stripe.Refund> {
    if (!paymentId) {
      throw new BadRequestException('Payment ID is required');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentId,
    });
    return refund;
  }
}

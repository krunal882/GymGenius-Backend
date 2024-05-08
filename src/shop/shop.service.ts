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
import Stripe from 'stripe';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateProductDto } from './dto/update-product.dto';
import { AuthService } from './../auth/auth.service';
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
      {
        apiVersion: '2020-08-27',
      },
    );
  }

  async getShowcaseProduct(limit?: number): Promise<Product[]> {
    // Fetch all distinct categories available in products
    const categories = await this.productModel.distinct('category');

    const showcaseProducts: Product[] = [];

    // Iterate over each category
    for (const category of categories) {
      let products;
      if (limit) {
        // Fetch products with the specified limit
        products = await this.productModel
          .find({
            category,
            state: 'active',
          })
          .limit(limit);
      } else {
        // Fetch all products for the category
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
    const cartProduct = await this.historyModel.find({
      userId,
    });

    if (!cartProduct || cartProduct.length === 0) {
      return;
    }

    return cartProduct;
  }

  async getPurchaseHistory(cartDto: cartDto): Promise<History[]> {
    return await this.productModel.find({
      userId: cartDto.userId,
      status: 'done',
    });
  }

  async getFilteredProduct(queryParams: any): Promise<Product[]> {
    const filter: any = {};

    if (queryParams.title) {
      filter.title = queryParams.title;
    }
    if (queryParams.category) {
      filter.category = queryParams.category;
    }
    if (queryParams.id) {
      filter._id = queryParams.id;
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

    const product = await this.productModel.find({
      ...filter,
      state: 'active',
    });

    if (queryParams['HighToLow'] !== undefined) {
      product.sort((a: any, b: any) => parseInt(b.price) - parseInt(a.price));
    } else if (queryParams['LowToHigh'] !== undefined) {
      product.sort((a: any, b: any) => parseInt(a.price) - parseInt(b.price));
    } else if (queryParams['sortByOff'] !== undefined) {
      product.sort(
        (a: any, b: any) => parseInt(b.off.trim()) - parseInt(a.off.trim()),
      );
    }

    return product;
  }

  async getAllOrders(): Promise<any> {
    const orders = await this.historyModel.find(); // Fetch all orders

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
    try {
      await createOne(this.productModel, productDto);
      return 'Successfully added product';
    } catch (error) {
      throw new BadRequestException('Error while adding product');
    }
  }

  async addCartProduct(cartDto: cartDto): Promise<string> {
    try {
      const existingCart = await this.historyModel.findOne({
        userId: cartDto.userId,
      });
      if (existingCart) {
        // If the cart exists, update it by adding the product ID
        existingCart.product.push(...cartDto.product);
        await existingCart.save();
      } else {
        // If the cart doesn't exist, create a new one
        await createOne(this.historyModel, {
          userId: cartDto.userId,
          productId: [], // Initialize productId as an array with the new product ID
        });
        const newCart = await this.historyModel.findOne({
          userId: cartDto.userId,
        });
        newCart.product.push(...cartDto.product);
        await newCart.save();
      }
      return 'Successfully added product to cart';
    } catch (error) {
      throw new BadRequestException('Error while adding product');
    }
  }

  async removeCart(userId: string, productId: string): Promise<string> {
    try {
      const products = await this.historyModel.findOne({ userId });
      const productIndex = products.product.findIndex(
        (product) => product.productId === productId,
      );

      if (productIndex === -1) {
        return 'product not found in cart';
      }

      products.product.splice(productIndex, 1);

      await products.save();

      return 'Successfully removed product from cart';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Error while removing product from cart');
      }
    }
  }
  async updateCart(userId: string, productId: string[]): Promise<string> {
    try {
      // Iterate over each productId and update the status in the cart
      for (const id of productId) {
        const filter = { userId, 'product.productId': id };
        const update = { $set: { 'product.$.status': 'done' } };
        const result = await this.historyModel.updateOne(filter, update);

        // Check if any document was matched and updated
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

  async removeProduct(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      await deleteOne(this.productModel, id);
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
    return await updateOne(this.productModel, id, updateData);
  }

  async productPurchase(price: number, quantity: string, title: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `http://localhost:8081/store/equipments`,
      cancel_url: `http://localhost:8081/store/equipments`,
      customer_email: 'krunalvekariya254@gmail.com',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: title,
              description: `you are purchasing the  product`,
              metadata: {
                // category: category, // Include product category
                // You can include more metadata properties as needed

                totalQuantity: quantity,
              },
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
    });
    return session;
  }
}

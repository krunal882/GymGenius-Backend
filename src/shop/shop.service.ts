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
import { User } from 'src/auth/schema/user.schema';
@Injectable()
export class ShopService {
  private stripe;
  constructor(
    @InjectModel('Product') private productModel: mongoose.Model<Product>,
    @InjectModel('History') private historyModel: mongoose.Model<History>,
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

  async getCartProduct(userId: object): Promise<Product[]> {
    console.log(userId);
    return await this.historyModel.find({
      userId,
      status: 'pending',
    });
  }

  async getPurchaseHistory(cartDto: cartDto): Promise<Product[]> {
    return await this.productModel.find({
      _id: cartDto.userId,
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

  async productPurchase(user: User, productDto: ProductDto) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `http://localhost:8081/store/equipments`,
      cancel_url: `http://localhost:8081/store/equipments`,
      customer_email: 'krunalvekariya254@gmail.com',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: productDto.title,
              description: `you are purchasing the  product`,
              metadata: {
                category: productDto.category, // Include product category
                brand: productDto.brand, // Include product brand
                // You can include more metadata properties as needed
              },
            },
            unit_amount: productDto.price * 100,
          },
          quantity: 1,
        },
      ],
    });
    console.log(session);
    return session;
  }
}

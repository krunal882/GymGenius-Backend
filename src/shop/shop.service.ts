import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import mongoose from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Product.name) private productModel: mongoose.Model<Product>,
  ) {}

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

  async getFilteredProduct(queryParams: any): Promise<Product[]> {
    const filter: any = {};

    if (queryParams.title) {
      filter.title = queryParams.title;
    }
    if (queryParams.category) {
      filter.category = queryParams.category;
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
}

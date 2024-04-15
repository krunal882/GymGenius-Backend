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

  async getShowcaseProduct(): Promise<Product[]> {
    // Fetch all distinct categories available in products
    const categories = await this.productModel.distinct('category');

    const showcaseProducts: Product[] = [];

    // Iterate over each category
    for (const category of categories) {
      const products = await this.productModel
        .find({ category, state: 'active' })
        .limit(12);
      showcaseProducts.push(...products);
    }

    return showcaseProducts;
  }

  async getFilteredProduct(queryParams: any): Promise<Product[]> {
    const filter: any = {};

    const filterableKeys = [
      'title',
      'category',
      'sortPriceLtoH',
      'sortPriceHtoL',
      'sortByOff',
    ];

    filterableKeys.forEach((key) => {
      if (queryParams[key]) {
        filter[key] = queryParams[key];
      }
    });

    const product = await this.productModel.find({ filter, state: 'active' });

    if (Object.keys(queryParams).includes('sortPriceLtoH')) {
      product.sort(
        (a: any, b: any) => parseInt(a.price.trim()) - parseInt(b.price.trim()),
      ); // Sort in ascending order by price
      return product;
    }

    if (Object.keys(queryParams).includes('sortPriceHtoL')) {
      product.sort(
        (a: any, b: any) => parseInt(b.price.trim()) - parseInt(a.price.trim()),
      ); // Sort in ascending order by price
      return product;
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

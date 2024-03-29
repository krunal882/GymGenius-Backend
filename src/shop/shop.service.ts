import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import mongoose from 'mongoose';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Product.name) private product: mongoose.Model<Product>,
  ) {}

  async getShowcaseProduct(): Promise<Product[]> {
    // Fetch all distinct categories available in products
    const categories = await this.product.distinct('category');

    const showcaseProducts: Product[] = [];

    // Iterate over each category
    for (const category of categories) {
      const products = await this.product.find({ category }).limit(12);
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

    const product = await this.product.find(filter);

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
}

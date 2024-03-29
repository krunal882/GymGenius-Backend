import { Controller, Get, Query } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('store')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('/')
  async getShowcaseProduct() {
    return await this.shopService.getShowcaseProduct();
  }

  @Get('/filtered')
  async getFilteredProduct(
    @Query('title') title: string,
    @Query('category') category: string,
    @Query('sortPriceLtoH') sortPriceLtoH: string,
    @Query('sortPriceHtoL') sortPriceHtoL: string,
    @Query('sortByOff') sortByOff: string,
  ) {
    const queryParams = {
      title,
      category,
      sortPriceLtoH,
      sortPriceHtoL,
      sortByOff,
    };
    return await this.shopService.getFilteredProduct(queryParams);
  }
}

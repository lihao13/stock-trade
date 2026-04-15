import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { Order } from './order.entity';

@Controller('api/trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('orders')
  getOrders() {
    return this.tradeService.getOrders();
  }

  @Get('positions')
  getPositions() {
    return this.tradeService.getPositions();
  }

  @Post('order')
  createOrder(@Body() order: Partial<Order>) {
    return this.tradeService.createOrder(order);
  }

  @Delete('order/:id')
  cancelOrder(@Param('id') id: string) {
    return this.tradeService.cancelOrder(+id);
  }

  @Get('portfolio')
  getPortfolio() {
    return this.tradeService.getPortfolioStats();
  }

  @Get('search')
  searchStocks(@Query('q') q: string) {
    return this.tradeService.searchStocks(q);
  }
}

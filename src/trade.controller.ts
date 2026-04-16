import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { TradeService, MarketKind } from './trade.service';
import { Order } from './order.entity';

@Controller('api/trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('orders')
  getOrders(@Query('market') market?: MarketKind) {
    return this.tradeService.getOrders(market);
  }

  @Get('positions')
  getPositions(@Query('market') market?: MarketKind) {
    return this.tradeService.getPositions(market);
  }

  @Post('order')
  createOrder(@Body() order: Partial<Order>) {
    return this.tradeService.createOrder(order);
  }

  @Delete('order/:id')
  cancelOrder(@Param('id') id: string) {
    return this.tradeService.cancelOrder(+id);
  }

  @Post('order/:id/complete')
  completeOrder(@Param('id') id: string) {
    return this.tradeService.completeOrder(+id);
  }

  @Get('portfolio')
  getPortfolio(@Query('market') market?: MarketKind) {
    return this.tradeService.getPortfolioStats(market);
  }

  @Get('search')
  searchStocks(
    @Query('q') q: string,
    @Query('kind') kind?: 'stock' | 'etf' | 'crypto',
  ) {
    return this.tradeService.searchStocks(q || '', kind);
  }

  @Get('instruments/:kind')
  listInstruments(@Param('kind') kind: 'stock' | 'etf' | 'crypto') {
    return this.tradeService.listInstruments(kind);
  }
}

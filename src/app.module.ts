import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { SeedService } from './seed.service';
import { Order } from './order.entity';
import { Position } from './position.entity';
import { Stock } from './stock.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'stock-trade.db',
      entities: [Order, Position, Stock],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Order, Position, Stock]),
  ],
  controllers: [AppController, TradeController],
  providers: [AppService, TradeService, SeedService],
})
export class AppModule {}

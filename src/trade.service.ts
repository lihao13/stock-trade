import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Position } from './position.entity';
import { Stock } from './stock.entity';

export type MarketKind = 'stock' | 'etf' | 'crypto';

function positionKey(market: string, symbol: string) {
  return `${market || 'stock'}:${symbol}`;
}

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async getOrders(market?: MarketKind) {
    const qb = this.orderRepository
      .createQueryBuilder('o')
      .orderBy('o.timestamp', 'DESC');
    if (market) {
      qb.where('o.market = :market', { market });
    }
    return qb.getMany();
  }

  async getPositions(market?: MarketKind) {
    const qb = this.positionRepository
      .createQueryBuilder('p')
      .orderBy('p.updateTime', 'DESC');
    if (market) {
      qb.where('p.market = :market', { market });
    }
    return qb.getMany();
  }

  async createOrder(order: Partial<Order>) {
    const market = (order.market as MarketKind) || 'stock';
    const newOrder = this.orderRepository.create({
      ...order,
      market,
      timestamp: order.timestamp ?? Date.now(),
      status: order.status ?? 'pending',
    });
    await this.orderRepository.save(newOrder);
    await this.updatePositions();
    return newOrder;
  }

  async cancelOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    if (order.status !== 'pending') {
      return {
        success: false,
        message: 'Only pending orders can be cancelled',
      };
    }
    order.status = 'cancelled';
    await this.orderRepository.save(order);
    await this.updatePositions();
    return { success: true };
  }

  async completeOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    if (order.status !== 'pending') {
      return {
        success: false,
        message: 'Only pending orders can be completed',
      };
    }
    order.status = 'completed';
    await this.orderRepository.save(order);
    await this.updatePositions();
    return { success: true, order };
  }

  async updatePositions() {
    const completedOrders = await this.orderRepository.find({
      where: { status: 'completed' },
    });

    await this.positionRepository.clear();

    const positionMap = new Map<
      string,
      {
        symbol: string;
        market: MarketKind;
        totalQuantity: number;
        totalAmount: number;
      }
    >();

    completedOrders.forEach((order) => {
      const market = (order.market as MarketKind) || 'stock';
      const key = positionKey(market, order.symbol);
      if (!positionMap.has(key)) {
        positionMap.set(key, {
          symbol: order.symbol,
          market,
          totalQuantity: 0,
          totalAmount: 0,
        });
      }
      const pos = positionMap.get(key);
      if (order.side === 'buy') {
        pos.totalQuantity += Number(order.quantity);
        pos.totalAmount += Number(order.price) * Number(order.quantity);
      } else {
        pos.totalQuantity -= Number(order.quantity);
        pos.totalAmount -= Number(order.price) * Number(order.quantity);
      }
      positionMap.set(key, pos);
    });

    for (const [, pos] of positionMap) {
      if (pos.totalQuantity > 0) {
        const position = new Position();
        position.symbol = pos.symbol;
        position.market = pos.market;
        position.avgPrice = pos.totalAmount / pos.totalQuantity;
        position.quantity = pos.totalQuantity;
        position.currentPrice = position.avgPrice;
        position.marketValue = position.avgPrice * position.quantity;
        position.pnl = 0;
        position.pnlPercent = 0;
        position.updateTime = Date.now();
        await this.positionRepository.save(position);
      }
    }
  }

  async getPortfolioStats(market?: MarketKind) {
    const positions = await this.getPositions(market);
    const orders = await this.getOrders(market);

    let totalMarketValue = 0;
    let totalPnL = 0;
    let totalCost = 0;

    positions.forEach((p) => {
      totalMarketValue += Number(p.marketValue);
      totalPnL += Number(p.pnl);
      totalCost += Number(p.avgPrice) * Number(p.quantity);
    });

    const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return {
      totalPositions: positions.length,
      totalMarketValue,
      totalPnL,
      totalCost,
      pnlPercent: Number(pnlPercent.toFixed(2)),
      positions,
      recentOrders: orders.slice(0, 20),
    };
  }

  async searchStocks(query: string, kind?: 'stock' | 'etf' | 'crypto') {
    const qb = this.stockRepository.createQueryBuilder('stock');
    if (query) {
      qb.where('(stock.symbol LIKE :query OR stock.name LIKE :query)', {
        query: `%${query}%`,
      });
    }
    if (kind) {
      if (query) {
        qb.andWhere('stock.kind = :kind', { kind });
      } else {
        qb.where('stock.kind = :kind', { kind });
      }
    }
    return qb.orderBy('stock.symbol', 'ASC').take(50).getMany();
  }

  async listInstruments(kind: 'stock' | 'etf' | 'crypto') {
    return this.stockRepository.find({
      where: { kind, isActive: true },
      order: { symbol: 'ASC' },
    });
  }
}

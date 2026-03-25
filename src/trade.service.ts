import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Position } from './position.entity';
import { Stock } from './stock.entity';

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

  async getOrders() {
    return this.orderRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getPositions() {
    return this.positionRepository.find({
      order: { updateTime: 'DESC' },
    });
  }

  async createOrder(order: Partial<Order>) {
    const newOrder = this.orderRepository.create(order);
    await this.orderRepository.save(newOrder);
    
    // 更新持仓
    await this.updatePositions();
    return newOrder;
  }

  async cancelOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    order.status = 'cancelled';
    await this.orderRepository.save(order);
    await this.updatePositions();
    return { success: true };
  }

  async updatePositions() {
    // 重新计算持仓
    // 这里简化处理，实际应该从订单计算
    const completedOrders = await this.orderRepository.find({ 
      where: { status: 'completed' } 
    });
    
    // 先清空，重新计算
    await this.positionRepository.clear();
    
    const positionMap = new Map<string, any>();
    
    completedOrders.forEach(order => {
      const key = order.symbol;
      if (!positionMap.has(key)) {
        positionMap.set(key, {
          symbol: order.symbol,
          totalQuantity: 0,
          totalAmount: 0,
        });
      }
      const pos = positionMap.get(key);
      
      if (order.side === 'buy') {
        pos.totalQuantity += order.quantity;
        pos.totalAmount += order.price * order.quantity;
      } else {
        pos.totalQuantity -= order.quantity;
        pos.totalAmount -= order.price * order.quantity;
      }
      
      positionMap.set(key, pos);
    });
    
    // 保存到数据库
    for (const [symbol, pos] of positionMap) {
      if (pos.totalQuantity > 0) {
        const position = new Position();
        position.symbol = symbol;
        position.avgPrice = pos.totalAmount / pos.totalQuantity;
        position.quantity = pos.totalQuantity;
        position.currentPrice = position.avgPrice; // 默认
        position.marketValue = position.avgPrice * position.quantity;
        position.pnl = 0;
        position.pnlPercent = 0;
        position.updateTime = Date.now();
        await this.positionRepository.save(position);
      }
    }
  }

  async getPortfolioStats() {
    const positions = await this.getPositions();
    const orders = await this.getOrders();
    
    let totalMarketValue = 0;
    let totalPnL = 0;
    let totalCost = 0;
    
    positions.forEach(p => {
      totalMarketValue += p.marketValue;
      totalPnL += p.pnl;
      totalCost += p.avgPrice * p.quantity;
    });
    
    const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    
    return {
      totalPositions: positions.length,
      totalMarketValue,
      totalPnL,
      totalCost,
      pnlPercent: Number(pnlPercent.toFixed(2)),
      positions,
      recentOrders: orders.slice(0, 10),
    };
  }

  async searchStocks(query: string) {
    if (!query) return [];
    return this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.symbol LIKE :query OR stock.name LIKE :query', { 
        query: `%${query}%` 
      })
      .take(20)
      .getMany();
  }
}

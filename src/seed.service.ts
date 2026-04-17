import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';

const SEED_INSTRUMENTS: Partial<Stock>[] = [
  // 股票示例
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    kind: 'stock',
    currentPrice: 178.5,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    exchange: 'NASDAQ',
    kind: 'stock',
    currentPrice: 415.2,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    exchange: 'NASDAQ',
    kind: 'stock',
    currentPrice: 142.8,
  },
  // ETF
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    exchange: 'ARCA',
    kind: 'etf',
    currentPrice: 502.1,
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    exchange: 'NASDAQ',
    kind: 'etf',
    currentPrice: 448.3,
  },
  {
    symbol: 'IVV',
    name: 'iShares Core S&P 500',
    exchange: 'ARCA',
    kind: 'etf',
    currentPrice: 525.0,
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market',
    exchange: 'ARCA',
    kind: 'etf',
    currentPrice: 268.4,
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    exchange: 'ARCA',
    kind: 'etf',
    currentPrice: 198.2,
  },
  // 加密货币（演示价格）
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    exchange: 'CRYPTO',
    kind: 'crypto',
    currentPrice: 67250,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    exchange: 'CRYPTO',
    kind: 'crypto',
    currentPrice: 3450,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    exchange: 'CRYPTO',
    kind: 'crypto',
    currentPrice: 145.2,
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    exchange: 'CRYPTO',
    kind: 'crypto',
    currentPrice: 612,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async onModuleInit() {
    for (const row of SEED_INSTRUMENTS) {
      const existing = await this.stockRepository.findOne({
        where: { symbol: row.symbol },
      });
      if (!existing) {
        const s = this.stockRepository.create({
          ...row,
          change: 0,
          changePercent: 0,
          isActive: true,
        });
        await this.stockRepository.save(s);
      }
    }
  }
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  quantity: number;

  @Column()
  side: 'buy' | 'sell';

  /** stock | etf | crypto */
  @Column({ default: 'stock' })
  market: 'stock' | 'etf' | 'crypto';

  @Column('decimal', { nullable: true })
  profit: number;

  @Column()
  timestamp: number;

  @Column({ default: 'completed' })
  status: 'completed' | 'cancelled' | 'pending';
}

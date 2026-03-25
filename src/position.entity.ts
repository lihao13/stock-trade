import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column('decimal')
  avgPrice: number;

  @Column('decimal')
  quantity: number;

  @Column('decimal')
  currentPrice: number;

  @Column('decimal')
  marketValue: number;

  @Column('decimal')
  pnl: number;

  @Column('decimal')
  pnlPercent: number;

  @Column()
  updateTime: number;
}

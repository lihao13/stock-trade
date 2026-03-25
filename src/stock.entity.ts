import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column()
  exchange: string;

  @Column('decimal', { nullable: true })
  currentPrice: number;

  @Column({ nullable: true })
  change: number;

  @Column({ nullable: true })
  changePercent: number;

  @Column({ default: true })
  isActive: boolean;
}

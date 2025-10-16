import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('commands')
export class CommandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  date: Date;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 20 })
  priority: string;

  @Column('jsonb')
  materials: any[];

  @Column({ length: 20, default: 'NEW' })
  status: string;

  @Column({ nullable: true })
  lastUpdateAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  updates: any[];

  @Column({ nullable: true })
  estimatedDelivery: Date;
}
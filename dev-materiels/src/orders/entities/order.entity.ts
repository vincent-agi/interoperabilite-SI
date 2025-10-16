import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNumber: string;

  @CreateDateColumn()
  receivedAt: Date;

  @Column()
  date: Date;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 20 })
  priority: string;

  @Column('jsonb')
  materials: any[];

  @Column({ length: 20, default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  processedAt: Date;
}
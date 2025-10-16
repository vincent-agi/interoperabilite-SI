import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('dev_materiels_logs')
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ length: 10 })
  level: string;

  @Column({ length: 100 })
  context: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  trace: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ length: 50 })
  service: string = 'dev-materiels';
}
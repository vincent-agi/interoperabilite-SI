import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);
  
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async save(order: Partial<OrderEntity>): Promise<OrderEntity> {
    try {
      this.logger.log(`Saving order: ${JSON.stringify(order)}`);
      const result = await this.orderRepository.save(order);
      this.logger.log(`Order saved successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to save order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
    return await this.orderRepository.findOne({ where: { orderNumber } });
  }

  async findAll(options?: {
    status?: string;
    department?: string;
    limit?: number;
    skip?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<OrderEntity[]> {
    const query = this.orderRepository.createQueryBuilder('order');

    if (options?.status) {
      query.andWhere('order.status = :status', { status: options.status });
    }

    if (options?.department) {
      query.andWhere('order.department = :department', { department: options.department });
    }

    if (options?.startDate) {
      query.andWhere('order.receivedAt >= :startDate', { startDate: options.startDate });
    }

    if (options?.endDate) {
      query.andWhere('order.receivedAt <= :endDate', { endDate: options.endDate });
    }

    query.orderBy('order.receivedAt', 'DESC');

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.skip) {
      query.offset(options.skip);
    }

    return await query.getMany();
  }

  async updateStatus(orderNumber: string, status: string): Promise<OrderEntity | null> {
    await this.orderRepository.update(
      { orderNumber },
      { 
        status,
        processedAt: status === 'COMPLETED' ? new Date() : undefined
      }
    );
    
    return this.findByOrderNumber(orderNumber);
  }
}
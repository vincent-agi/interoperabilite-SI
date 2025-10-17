import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandEntity } from './entities/command.entity';

@Injectable()
export class CommandRepository {
  private readonly logger = new Logger(CommandRepository.name);
  
  constructor(
    @InjectRepository(CommandEntity)
    private commandRepository: Repository<CommandEntity>,
  ) {}

  async save(command: Partial<CommandEntity>): Promise<CommandEntity> {
    try {
      this.logger.log(`Saving command: ${JSON.stringify(command)}`);
      const result = await this.commandRepository.save(command);
      this.logger.log(`Command saved successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to save command: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByOrderNumber(orderNumber: string): Promise<CommandEntity | null> {
    return await this.commandRepository.findOne({ where: { orderNumber } });
  }

  async findAll(options?: {
    status?: string;
    department?: string;
    limit?: number;
    skip?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<CommandEntity[]> {
    const query = this.commandRepository.createQueryBuilder('command');

    if (options?.status) {
      query.andWhere('command.status = :status', { status: options.status });
    }

    if (options?.department) {
      query.andWhere('command.department = :department', { department: options.department });
    }

    if (options?.startDate) {
      query.andWhere('command.createdAt >= :startDate', { startDate: options.startDate });
    }

    if (options?.endDate) {
      query.andWhere('command.createdAt <= :endDate', { endDate: options.endDate });
    }

    query.orderBy('command.createdAt', 'DESC');

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.skip) {
      query.offset(options.skip);
    }

    return await query.getMany();
  }

  async updateStatus(orderNumber: string, status: string, updateMessage?: string): Promise<CommandEntity | null> {
    const command = await this.findByOrderNumber(orderNumber);
    
    if (!command) {
      return null;
    }
    
    const now = new Date();
    
    if (!command.updates) {
      command.updates = [];
    }
    
    command.updates.push({
      timestamp: now,
      status,
      message: updateMessage || `Mise à jour du statut: ${status}`
    });
    
    command.status = status;
    command.lastUpdateAt = now;
    
    return await this.commandRepository.save(command);
  }
}
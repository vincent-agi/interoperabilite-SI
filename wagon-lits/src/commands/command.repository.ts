import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandEntity } from './entities/command.entity';

@Injectable()
export class CommandRepository {
  constructor(
    @InjectRepository(CommandEntity)
    private commandRepository: Repository<CommandEntity>,
  ) {}

  async save(command: Partial<CommandEntity>): Promise<CommandEntity> {
    return await this.commandRepository.save(command);
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
    
    // Initialiser le tableau des mises à jour si c'est la première
    if (!command.updates) {
      command.updates = [];
    }
    
    // Ajouter la mise à jour au tableau
    command.updates.push({
      timestamp: now,
      status,
      message: updateMessage || `Mise à jour du statut: ${status}`
    });
    
    // Mettre à jour le statut et la date de dernière mise à jour
    command.status = status;
    command.lastUpdateAt = now;
    
    return await this.commandRepository.save(command);
  }
}
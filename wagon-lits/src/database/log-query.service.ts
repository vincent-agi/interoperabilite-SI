import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class LogQueryService {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  async findAll(options?: {
    level?: string;
    context?: string;
    limit?: number;
    skip?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query = this.logRepository.createQueryBuilder('log');

    if (options?.level) {
      query.andWhere('log.level = :level', { level: options.level });
    }

    if (options?.context) {
      query.andWhere('log.context = :context', { context: options.context });
    }

    if (options?.startDate) {
      query.andWhere('log.timestamp >= :startDate', { startDate: options.startDate });
    }

    if (options?.endDate) {
      query.andWhere('log.timestamp <= :endDate', { endDate: options.endDate });
    }

    query.orderBy('log.timestamp', 'DESC');

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.skip) {
      query.offset(options.skip);
    }

    return await query.getMany();
  }

  async findById(id: string) {
    return await this.logRepository.findOne({ where: { id } });
  }

  async count(options?: {
    level?: string;
    context?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query = this.logRepository.createQueryBuilder('log');

    if (options?.level) {
      query.andWhere('log.level = :level', { level: options.level });
    }

    if (options?.context) {
      query.andWhere('log.context = :context', { context: options.context });
    }

    if (options?.startDate) {
      query.andWhere('log.timestamp >= :startDate', { startDate: options.startDate });
    }

    if (options?.endDate) {
      query.andWhere('log.timestamp <= :endDate', { endDate: options.endDate });
    }

    return await query.getCount();
  }
}
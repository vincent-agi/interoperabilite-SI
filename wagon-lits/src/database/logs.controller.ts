import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogQueryService } from './log-query.service';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly logQueryService: LogQueryService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('LogsController');
  }

  @Get()
  async getLogs(
    @Query('level') level?: string,
    @Query('context') context?: string,
    @Query('limit') limit = 100,
    @Query('skip') skip = 0,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    this.logger.log('Requête des logs', 'LogsController');

    const options: any = {
      level,
      context,
      limit: +limit,
      skip: +skip,
    };

    if (startDate) {
      options.startDate = new Date(startDate);
    }

    if (endDate) {
      options.endDate = new Date(endDate);
    }

    const [logs, count] = await Promise.all([
      this.logQueryService.findAll(options),
      this.logQueryService.count({ level, context, startDate: options.startDate, endDate: options.endDate }),
    ]);

    return {
      logs,
      count,
      limit: +limit,
      skip: +skip,
    };
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    this.logger.log(`Requête du log avec l'ID: ${id}`, 'LogsController');
    return this.logQueryService.findById(id);
  }
}
import { forwardRef, Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { DatabaseModule } from '../database/database.module';
import { NestLoggerAdapter } from './nest-logger-adapter';

@Module({
  imports: [
    forwardRef(() => DatabaseModule)
  ],
  providers: [
    CustomLoggerService,
    {
      provide: NestLoggerAdapter,
      useFactory: (customLogger: CustomLoggerService) => {
        return new NestLoggerAdapter(customLogger);
      },
      inject: [CustomLoggerService],
    },
  ],
  exports: [CustomLoggerService, NestLoggerAdapter],
})
export class LoggerModule {}
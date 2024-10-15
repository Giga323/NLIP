import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileMonitoringServiceService } from './services/file-monitoring-service/file-monitoring-service.service';
import { VectorStrategyFindingService } from './services/vector-strategy-finding/vector-strategy-finding.service';
import { FileServiceService } from './services/file-service/file-service.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FileMonitoringServiceService, VectorStrategyFindingService, FileServiceService],
})
export class AppModule {}

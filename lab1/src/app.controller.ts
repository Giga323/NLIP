import { VectorStrategyFindingService } from './services/vector-strategy-finding/vector-strategy-finding.service';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FileServiceService } from './services/file-service/file-service.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private vectorStrategyFindingService: VectorStrategyFindingService,
    private fileService: FileServiceService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('search')
  calculateMeasurements(@Query('word') word: string): Promise<any> {
    return this.vectorStrategyFindingService.find(word);
  }

  @Get('file-data')
  getFileData(@Query('fileName') name: string): Promise<any> {
    return this.fileService.extractWordsFromFile(name);
  }
}

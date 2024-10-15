import { FileServiceService } from './../file-service/file-service.service';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileMonitoringServiceService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly folderPath = './src/watching-folder';
  private readonly userFolder1 = './src/user1';
  private readonly userFolder2 = './src/user2';

  private watcher: fs.FSWatcher;
  private watchers: fs.FSWatcher[] = [];
  private readonly logger = new Logger(FileMonitoringServiceService.name);

  documents: string[] = [];

  constructor(private fileService: FileServiceService) {}

  onModuleInit() {
    console.log('Current working directory:', process.cwd());
    this.loadExistingDocuments(this.userFolder1);
    this.loadExistingDocuments(this.userFolder2);
    this.startWatching(this.userFolder1);
    this.startWatching(this.userFolder2);
  }

  onModuleDestroy() {
    this.stopWatching();
  }

  private loadExistingDocuments(folderPath) {
    this.logger.log(`Загрузка существующих файлов из папки ${folderPath}`);
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        this.logger.error(`Ошибка при чтении папки: ${err.message}`);
        return;
      }
      this.documents = [...this.documents, ...files]; // Сохраняем список существующих файлов
      this.logger.log(`Найдены следующие файлы: ${this.documents.join(', ')}`);
    });
  }

  private startWatching(folderpath: string) {
    this.logger.log(`Начинаем отслеживать изменения в папке ${folderpath}`);

    this.watchers.push(
      fs.watch(folderpath, (eventType, filename) => {
        const filePath = path.join(folderpath, filename);
        const mainFolderFilePath = path.join(this.folderPath, filename);
        if (eventType === 'rename') {
          if (fs.existsSync(filePath)) {
            this.logger.log(`Новый файл добавлен: ${filePath}`);
            this.documents = [...this.documents, filename];
            this.fileService.moveFile(filePath, mainFolderFilePath);
          } else {
            this.logger.log(`Файл удален: ${filePath}`);
            this.documents = this.documents.filter((file) => file !== filename);
            this.fileService.deleteFile(mainFolderFilePath);
          }
        }

        if (eventType === 'change') {
          this.logger.log(`Файл изменен: ${filename}`);
          this.documents = this.documents.filter((file) => file !== filename);
          this.documents = [...this.documents, filename];
          this.fileService.deleteFile(mainFolderFilePath);
          this.fileService.moveFile(filePath, mainFolderFilePath);
        }
      }),
    );
  }

  private stopWatching() {
    if (this.watchers.length) {
      for (let watcher of this.watchers) {
        watcher.close();
      }
      this.logger.log(`Отслеживание изменений в папках остановлено`);
    }
  }
}

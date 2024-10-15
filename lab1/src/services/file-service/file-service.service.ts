import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FileServiceService {
  async extractWordsFromFile(filename: string): Promise<string[]> {
    const filePath = './src/watching-folder/' + filename;

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      const words = content.match(/\b\w+\b/g);

      return words ? words : [];
    } catch (error) {
      throw new Error(`Ошибка при чтении файла: ${error.message}`);
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      console.log(sourcePath, destinationPath);
      fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath);
    });
  }

  async checkFileCreationDate(
    filePath: string,
    filePath2: string,
  ): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);

      const creationDate = stats.birthtime;

      const stats2 = await fs.stat(filePath2);

      const creationDate2 = stats2.birthtime;

      const isSameDate = this.isSameDay(creationDate, creationDate2);

      return isSameDate;
    } catch (error) {
      throw new HttpException(
        'Error accessing file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

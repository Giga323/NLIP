import { Injectable } from '@nestjs/common';
import { FileServiceService } from '../file-service/file-service.service';
import { FileMonitoringServiceService } from '../file-monitoring-service/file-monitoring-service.service';

@Injectable()
export class VectorStrategyFindingService {
  searchString: string = '';

  constructor(
    private fileService: FileServiceService,
    private fileMonitorService: FileMonitoringServiceService,
  ) {}

  find(searchString: string) {
    this.searchString = searchString;

    return this.startCalculatingVectorsForEachFile();
  }

  async startCalculatingVectorsForEachFile() {
    const similarityMeasurements = {};

    const files = this.fileMonitorService.documents;

    for (let file of files) {
      let measurement = await this.calculateSimilarityMeasureFile(file, files);

      similarityMeasurements[file] = measurement;
    }

    console.log(similarityMeasurements);

    return similarityMeasurements;
  }

  private async findDocumentsCountWhereWordIsExisting(
    word: string,
    files: string[],
  ) {
    let count = 0;

    for (let file of files) {
      const words = await this.fileService.extractWordsFromFile(file);

      count += words.filter((wordEl) => wordEl.includes(word)).length;
    }

    return count;
  }

  private async calculateSimilarityMeasureFile(file: string, files: string[]) {
    const vector = [];
    const queryVector = [];

    const words = await this.fileService.extractWordsFromFile(file);

    const denominator = await this.countDenominator(words, files);

    for (let word of words) {
      let N_dk = words.filter((wordEl) => wordEl.includes(word)).length;
      let N = files.length;
      let N_k = await this.findDocumentsCountWhereWordIsExisting(word, files);

      let vectorWordValue = (N_dk * Math.log2(N / N_k)) / denominator;
      vector.push(vectorWordValue);
      queryVector.push(this.searchString.includes(word) ? 1 : 0);
    }

    const scolarMultiplication = this.dotProduct(vector, queryVector);

    const euclidNormCommonVector = this.euclideanNorm(vector);
    const euclidNormQueryVector = this.euclideanNorm(queryVector);

    return (
      scolarMultiplication / (euclidNormCommonVector * euclidNormQueryVector)
    );
  }

  private async countDenominator(words: string[], files: string[]) {
    let sigma = 0;

    for (let word of words) {
      let N_dj = words.filter((wordEl) => wordEl.includes(word)).length;
      let N = files.length;
      let N_j = await this.findDocumentsCountWhereWordIsExisting(word, files);

      sigma += Math.pow(N_dj * Math.log2(N / N_j), 2);
    }

    return Math.sqrt(sigma);
  }

  private dotProduct(vecA: number[], vecB: number[]) {
    return vecA.reduce((sum, current, index) => sum + current * vecB[index], 0);
  }

  // Функция для нахождения евклидовой нормы
  private euclideanNorm(vec: number[]) {
    return Math.sqrt(vec.reduce((sum, current) => sum + current ** 2, 0));
  }
}

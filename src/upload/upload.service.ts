import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand, FeatureType } from '@aws-sdk/client-textract';
import { UploadRepository } from './upload.repository';
import { File } from '@prisma/client';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly textractClient: TextractClient,
  ) {}

  async saveImage(file: Express.Multer.File): Promise<File> {
    // Extraí o texto usando OCR
    const ocrText = await this.extractTextFromImage(file.buffer);
    
    // Salva a imagem e o texto extraído no banco de dados
    return this.uploadRepository.createFile(file.originalname, ocrText, file.buffer);
  }

  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    const params = {
      Document: {
        Bytes: imageBuffer,
      },
      FeatureTypes: ['TEXT_DETECTION' as FeatureType],
    };

    const command = new AnalyzeDocumentCommand(params);

    try {
      const response = await this.textractClient.send(command);
      return this.parseText(response);
    } catch (error) {
      console.error('Error processing image with Textract:', error);
      throw new Error('Could not process image');
    }
  }

  private parseText(response: any): string {
    if (!response || !response.Blocks) {
      return '';
    }

    const textBlocks = response.Blocks.filter(block => block.BlockType === 'LINE');
    return textBlocks.map(block => block.Text).join('\n');
  }
}

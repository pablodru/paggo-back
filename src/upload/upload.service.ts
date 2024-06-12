import { Injectable } from '@nestjs/common';
import { TextractClient, FeatureType } from '@aws-sdk/client-textract';
import { UploadRepository } from './upload.repository';
import { File } from '@prisma/client';
import { AWSTextractService } from 'src/aws-textract/awsTextract';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly awsTextract: AWSTextractService,
  ) {}

  async saveImage(file: Express.Multer.File): Promise<File> {
    const ocrText = await this.extractTextFromImage(file.buffer);

    return this.uploadRepository.createFile(
      file.originalname,
      ocrText,
      file.buffer,
    );
  }

  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    const params = {
      Document: {
        Bytes: imageBuffer,
      },
    };

    try {
      const response = await this.awsTextract.analyzeInvoice(params);
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

    const textBlocks = response.Blocks.filter(
      (block) => block.BlockType === 'LINE',
    );
    return textBlocks.map((block) => block.Text).join('\n');
  }
}

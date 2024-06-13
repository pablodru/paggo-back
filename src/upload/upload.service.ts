import { Injectable } from '@nestjs/common';
import { AnalyzeExpenseCommandOutput, TextractClient } from '@aws-sdk/client-textract';
import { UploadRepository } from './upload.repository';
import { AWSTextractService } from '..//aws-textract/awsTextract';
import * as fs from 'fs/promises';
import { userSession } from '@prisma/client';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly awsTextract: AWSTextractService,
  ) {}

  async loadText(file: Express.Multer.File, user: userSession): Promise<any> {
    
    const buffer = await fs.readFile(file.path);
    const existingInvoice = await this.uploadRepository.findTextByBuffer(buffer);
    if (existingInvoice){
      return {ocrText: existingInvoice.text}
    }
    
    const ocrText = await this.extractTextFromImage(buffer);

    await this.uploadRepository.createFile(
      file.originalname,
      ocrText,
      buffer,
      user.id
    );

    return {
      ocrText,
    };
  }

  private async extractTextFromImage(buffer: Buffer): Promise<string> {
    const params = {
      Document: {
        Bytes: buffer,
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

  private parseText(response: AnalyzeExpenseCommandOutput): string {
    if (!response || !response.ExpenseDocuments || !response.ExpenseDocuments.length) {
      return '';
    }

    const expenseDocument = response.ExpenseDocuments[0];
    const blocks = expenseDocument.Blocks;

    if (!blocks || !blocks.length) {
      return '';
    }

    const textBlocks = blocks.filter(block => block.BlockType === 'LINE');
    const texts = textBlocks.map(block => block.Text).join('\n');

    return texts;
  }
}

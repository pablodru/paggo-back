import { Injectable } from '@nestjs/common';
import {
  AnalyzeExpenseCommand,
  AnalyzeExpenseCommandInput,
  TextractClient,
} from '@aws-sdk/client-textract';

@Injectable()
export class AWSTextractService {
  private textractClient: TextractClient;

  constructor() {
    this.textractClient = new TextractClient({
      region: 'us-east-1',
    });
  }

  async analyzeInvoice(params: AnalyzeExpenseCommandInput) {
    try {
      const aExpense = new AnalyzeExpenseCommand(params);
      const response = await this.textractClient.send(aExpense);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

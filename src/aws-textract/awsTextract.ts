import { Injectable } from '@nestjs/common';
import {
  AnalyzeExpenseCommand,
  AnalyzeExpenseCommandInput,
  TextractClient,
} from '@aws-sdk/client-textract';
import { fromIni } from '@aws-sdk/credential-providers';

const profileName = 'default';

@Injectable()
export class AWSTextractService {
  private textractClient: TextractClient;
  constructor() {
    this.textractClient = new TextractClient({
      credentials: fromIni({ profile: profileName }),
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

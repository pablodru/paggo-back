import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadRepository } from './upload.repository';
import * as dotenv from 'dotenv';
import { AWSTextractService } from 'src/aws-textract/awsTextract';

dotenv.config();

@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    AWSTextractService
  ],
})
export class UploadModule {}

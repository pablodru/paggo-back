import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadRepository } from './upload.repository';
import { TextractClient } from '@aws-sdk/client-textract';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    {
      provide: TextractClient,
      useFactory: () => {
        return new TextractClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
      },
    },
  ],
})
export class UploadModule {}

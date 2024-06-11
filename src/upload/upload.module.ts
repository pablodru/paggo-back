import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadRepository } from './upload.repository';
import * as dotenv from 'dotenv';
import { AWSTextractService } from 'src/aws-textract/awsTextract';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

dotenv.config();

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    AWSTextractService,
    AuthService
  ],
})
export class UploadModule {}

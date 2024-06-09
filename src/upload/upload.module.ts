import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadRepository } from './upload.repository';

@Module({
  imports: [PrismaModule],  // Importa o PrismaModule para que o UploadService possa usá-lo
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}

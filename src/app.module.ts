import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, UploadModule, AuthModule],
  providers: [PrismaService]
})
export class AppModule {}

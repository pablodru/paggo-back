import { File } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class UploadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFile(filename: string, text: string, data: Buffer): Promise<File> {
    return this.prisma.file.create({
      data: {
        filename,
        text,
        data,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
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

  async findTextByBuffer(data: Buffer) {
    return this.prisma.file.findFirst({
      where: { data }
    })
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async saveImage(file: Express.Multer.File, text: string) {
    const newFile = await this.prisma.file.create({
      data: {
        filename: file.originalname,
        text: text,
        data: file.buffer,
      },
    });

    return newFile;
  }
}

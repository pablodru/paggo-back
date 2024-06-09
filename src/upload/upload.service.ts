import { Injectable } from '@nestjs/common';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async saveImage(file: Express.Multer.File, text: string) {
    return this.uploadRepository.createFile(file.originalname, text, file.buffer);
  }
}

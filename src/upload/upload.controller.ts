import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { AuthService } from '../auth/auth.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly authService: AuthService,
  ) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') token: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is not provided.');
    }

    if (!token) {
      throw new UnauthorizedException('Authorization token is not provided.');
    }

    await this.authService.validateToken(token);

    const response = await this.uploadService.loadText(file);

    return response;
  }
}

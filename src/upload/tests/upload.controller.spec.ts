import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../upload.controller';
import { UploadService } from '../upload.service';
import { AuthService } from '../../auth/auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            loadText: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if file is not provided', async () => {
    await expect(controller.uploadFile(null, 'token')).rejects.toThrow(BadRequestException);
  });

  it('should throw UnauthorizedException if token is not provided', async () => {
    await expect(controller.uploadFile({} as Express.Multer.File, null)).rejects.toThrow(UnauthorizedException);
  });

  it('should call authService.validateToken and uploadService.loadText', async () => {
    const mockFile = { path: 'path/to/file' } as Express.Multer.File;
    const mockToken = 'valid-token';
    const mockResponse = { ocrText: 'mocked text' };

    (authService.validateToken as jest.Mock).mockResolvedValue(true);
    (uploadService.loadText as jest.Mock).mockResolvedValue(mockResponse);

    const response = await controller.uploadFile(mockFile, mockToken);

    expect(authService.validateToken).toHaveBeenCalledWith(mockToken);
    expect(uploadService.loadText).toHaveBeenCalledWith(mockFile);
    expect(response).toEqual(mockResponse);
  });
});

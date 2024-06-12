import { Test, TestingModule } from '@nestjs/testing';
import { UploadRepository } from '../upload.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('UploadRepository', () => {
  let repository: UploadRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadRepository,
        {
          provide: PrismaService,
          useValue: {
            file: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UploadRepository>(UploadRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a file', async () => {
    const mockFile = {
      filename: 'test.jpg',
      text: 'extracted text',
      data: Buffer.from('test buffer'),
    };

    (prisma.file.create as jest.Mock).mockResolvedValue(mockFile);

    const result = await repository.createFile(mockFile.filename, mockFile.text, mockFile.data);

    expect(prisma.file.create).toHaveBeenCalledWith({
      data: {
        filename: mockFile.filename,
        text: mockFile.text,
        data: mockFile.data,
      },
    });
    expect(result).toEqual(mockFile);
  });

  it('should find a file by buffer', async () => {
    const mockBuffer = Buffer.from('test buffer');
    const mockFile = { text: 'extracted text' };

    (prisma.file.findFirst as jest.Mock).mockResolvedValue(mockFile);

    const result = await repository.findTextByBuffer(mockBuffer);

    expect(prisma.file.findFirst).toHaveBeenCalledWith({
      where: { data: mockBuffer },
    });
    expect(result).toEqual(mockFile);
  });
});

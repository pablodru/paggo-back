import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from '../upload.service';
import { UploadRepository } from '../upload.repository';
import { AWSTextractService } from '../../aws-textract/awsTextract';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('UploadService', () => {
  let service: UploadService;
  let uploadRepository: UploadRepository;
  let awsTextract: AWSTextractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: UploadRepository,
          useValue: {
            createFile: jest.fn(),
            findTextByBuffer: jest.fn(),
          },
        },
        {
          provide: AWSTextractService,
          useValue: {
            analyzeInvoice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadRepository = module.get<UploadRepository>(UploadRepository);
    awsTextract = module.get<AWSTextractService>(AWSTextractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return existing text if file already exists', async () => {
    const mockBuffer = Buffer.from('test buffer');
    const mockFile = { path: 'path/to/file' } as Express.Multer.File;
    const mockText = 'existing text';

    (fs.readFile as jest.Mock).mockResolvedValue(mockBuffer);
    (uploadRepository.findTextByBuffer as jest.Mock).mockResolvedValue({ text: mockText });

    const response = await service.loadText(mockFile);

    expect(fs.readFile).toHaveBeenCalledWith(mockFile.path);
    expect(uploadRepository.findTextByBuffer).toHaveBeenCalledWith(mockBuffer);
    expect(response).toEqual({ ocrText: mockText });
  });

  it('should create a new file if not already exists', async () => {
    const mockBuffer = Buffer.from('test buffer');
    const mockFile = { path: 'path/to/file', originalname: 'test.jpg' } as Express.Multer.File;
    const mockText = 'extracted text';

    (fs.readFile as jest.Mock).mockResolvedValue(mockBuffer);
    (uploadRepository.findTextByBuffer as jest.Mock).mockResolvedValue(null);
    (awsTextract.analyzeInvoice as jest.Mock).mockResolvedValue({
      ExpenseDocuments: [
        {
          Blocks: [{ BlockType: 'LINE', Text: mockText }],
        },
      ],
    });
    (uploadRepository.createFile as jest.Mock).mockResolvedValue(true);

    const response = await service.loadText(mockFile);

    expect(fs.readFile).toHaveBeenCalledWith(mockFile.path);
    expect(uploadRepository.findTextByBuffer).toHaveBeenCalledWith(mockBuffer);
    expect(awsTextract.analyzeInvoice).toHaveBeenCalled();
    expect(uploadRepository.createFile).toHaveBeenCalledWith(mockFile.originalname, mockText, mockBuffer);
    expect(response).toEqual({ ocrText: mockText });
  });
});

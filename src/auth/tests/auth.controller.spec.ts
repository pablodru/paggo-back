import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return error if email or token is missing', async () => {
    const result = await controller.authenticateUser({ email: '', token: '' });
    expect(result).toEqual({ success: false, message: 'Email and token are required' });
  });

  it('should call authService.authenticateUser and return its result', async () => {
    const mockResponse = { success: true, message: 'Authentication successful' };
    (authService.authenticateUser as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.authenticateUser({ email: 'test@example.com', token: 'valid-token' });

    expect(authService.authenticateUser).toHaveBeenCalledWith('test@example.com', 'valid-token');
    expect(result).toEqual(mockResponse);
  });
});

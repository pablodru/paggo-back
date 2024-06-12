import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findUser: jest.fn(),
            updateUserToken: jest.fn(),
            createUser: jest.fn(),
            findUserByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate existing user and update token', async () => {
    const email = 'test@example.com';
    const token = 'new-token';
    (authRepository.findUser as jest.Mock).mockResolvedValue({ email });
    (authRepository.updateUserToken as jest.Mock).mockResolvedValue(true);

    const result = await service.authenticateUser(email, token);

    expect(authRepository.findUser).toHaveBeenCalledWith(email);
    expect(authRepository.updateUserToken).toHaveBeenCalledWith(email, token);
    expect(result).toEqual({ success: true, message: 'Authentication successful' });
  });

  it('should create new user if not existing', async () => {
    const email = 'new@example.com';
    const token = 'new-token';
    (authRepository.findUser as jest.Mock).mockResolvedValue(null);
    (authRepository.createUser as jest.Mock).mockResolvedValue(true);

    const result = await service.authenticateUser(email, token);

    expect(authRepository.findUser).toHaveBeenCalledWith(email);
    expect(authRepository.createUser).toHaveBeenCalledWith(email, token);
    expect(result).toEqual({ success: true, message: 'Authentication successful' });
  });

  it('should validate token and return true for valid token', async () => {
    const token = 'valid-token';
    (authRepository.findUserByToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

    const result = await service.validateToken(`Bearer ${token}`);

    expect(authRepository.findUserByToken).toHaveBeenCalledWith(token);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const token = 'invalid-token';
    (authRepository.findUserByToken as jest.Mock).mockResolvedValue(null);

    await expect(service.validateToken(`Bearer ${token}`)).rejects.toThrow(UnauthorizedException);
  });
});

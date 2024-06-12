import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from '../auth.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: PrismaService,
          useValue: {
            userSession: {
              findUnique: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find user by email', async () => {
    const email = 'test@example.com';
    const mockUser: userSessionToTest = { email, token: 'token' };

    (prisma.userSession.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.findUser(email);

    expect(prisma.userSession.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(result).toEqual(mockUser);
  });

  it('should update user token', async () => {
    const email = 'test@example.com';
    const token = 'new-token';
    const mockUser: userSessionToTest = { email, token };

    (prisma.userSession.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.updateUserToken(email, token);

    expect(prisma.userSession.update).toHaveBeenCalledWith({
      where: { email },
      data: { token },
    });
    expect(result).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const email = 'new@example.com';
    const token = 'new-token';
    const mockUser: userSessionToTest = { email, token };

    (prisma.userSession.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.createUser(email, token);

    expect(prisma.userSession.create).toHaveBeenCalledWith({
      data: { email, token },
    });
    expect(result).toEqual(mockUser);
  });

  it('should find user by token', async () => {
    const token = 'token';
    const mockUser: userSessionToTest = { email: 'test@example.com', token };

    (prisma.userSession.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.findUserByToken(token);

    expect(prisma.userSession.findUnique).toHaveBeenCalledWith({
      where: { token },
    });
    expect(result).toEqual(mockUser);
  });
});

type userSessionToTest = {
    email: string,
    token: string
}
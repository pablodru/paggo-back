import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async authenticateUser(email: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const existingUser = await this.authRepository.findUser(email);

      if (existingUser) {
        await this.authRepository.updateUserToken(email, token);
      } else {
        await this.authRepository.createUser(email, token);
      }

      return { success: true, message: 'Authentication successful' };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, message: 'Internal Server Error' };
    }
  }

  async validateToken(authorization: string) {
    const token = authorization.split(' ')[1];
    const user = await this.authRepository.findUserByToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }
    return user;
  }
}

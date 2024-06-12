import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async authenticateUser(@Body() body: { email: string; token: string }): Promise<{ success: boolean; message: string }> {
    const { email, token } = body;

    if (!email || !token) {
      return { success: false, message: 'Email and token are required' };
    }

    return await this.authService.authenticateUser(email, token);
  }
}

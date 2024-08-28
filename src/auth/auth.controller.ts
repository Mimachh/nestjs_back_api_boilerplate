import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LogUserDto } from './dto/log-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() authBody: LogUserDto) {
    return await this.authService.login({ authBody });
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register({ registerBody });
  }

  @Post('confirm-email/:token')
  async confirmEmail(@Param('token') request: ConfirmEmailDto) {
    return await this.authService.confirmEmail({token: request.token});
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto ) {
    return await this.authService.askForPasswordReset({email: body.email});
  }

  @UseGuards(JwtAuthGuard)
  @Get() 
  async getAuthenticatedUser(@Req() request: RequestWithUser) {
    return await this.userService.getUser({userId: request.user.userId});
  }
}

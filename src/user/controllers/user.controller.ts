import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth-guard';
import { RoleGuard } from 'src/auth/guards/role-guard';
import { CreateUserRequest } from '../dto/create-user.request';
import { LoginUserRequest } from '../dto/login-user-request';
import { UserResponse } from '../dto/user.response';
import { UserService } from '../services/user.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    return this.userService.createUser(createUserRequest);
  }

  @Post('signin')
  async signIn(@Body() loginUserRequest: LoginUserRequest): Promise<string> {
    return this.userService.signInUser(loginUserRequest);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  async checkAuth(@Request() req): Promise<any> {
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Get('test')
  @ApiBearerAuth('JWT-auth')
  async checkAutha(): Promise<string> {
    return 'hello';
  }
}

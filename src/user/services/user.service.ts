import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import { CreateUserRequest } from '../dto/create-user.request';
import { LoginUserRequest } from '../dto/login-user-request';
import { UserResponse } from '../dto/user.response';
import { User } from '../models/user.modal';
import { UserRepository } from '../repository/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signInUser(loginUserRequest: LoginUserRequest): Promise<string> {
    const user = await this.userRepository.findOneByEmail(
      loginUserRequest.email,
    );
    if (!user) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'User not found!' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (await bcrypt.compare(loginUserRequest.password, user.password)) {
      const token = this.jwtService.sign({ id: user.id });
      return token;
    }
    throw new HttpException(
      { status: HttpStatus.NOT_ACCEPTABLE, error: 'Wrong Password' },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  async createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    await this.validateCreateUserRequest(createUserRequest);
    const user = await this.userRepository.insertOne({
      ...createUserRequest,
      password: await hash(createUserRequest.password, 10),
    });
    return this.buildResponse(user);
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOneById(userId);
    return user;
  }

  private async validateCreateUserRequest(
    createUserRequest: CreateUserRequest,
  ): Promise<void> {
    const user = await this.userRepository.findOneByEmail(
      createUserRequest.email,
    );
    if (user) {
      throw new BadRequestException('This email already exists.');
    }
  }

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id.toHexString(),
      email: user.email,
    };
  }
}

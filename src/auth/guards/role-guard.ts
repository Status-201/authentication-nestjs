import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userData = await this.userRepository.findOneById(user.id);
    if (userData.admin) {
      return true;
    } else {
      return false;
    }
  }
}

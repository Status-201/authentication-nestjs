import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

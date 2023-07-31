import { IsString, IsEmail, IsStrongPassword, Contains } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @Contains('ADMIN' || 'USERS')
  role: string;
}

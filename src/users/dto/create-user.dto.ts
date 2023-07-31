import { IsString, IsEmail, IsStrongPassword, IsEnum } from 'class-validator';

enum Role {
  'ADMIN',
  'USER',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(Role, {
    message: 'role must be either "ADMIN" OR "USER"',
  })
  role: string;
}

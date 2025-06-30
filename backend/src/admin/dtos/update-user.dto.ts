import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '../../../generated/prisma';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

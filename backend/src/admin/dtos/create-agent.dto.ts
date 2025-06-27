import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

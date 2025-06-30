import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ConfirmResetDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;

  @MinLength(6)
  newPassword: string;
}

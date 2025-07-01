import { IsOptional, IsString } from 'class-validator';

export class UpdateAgentProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

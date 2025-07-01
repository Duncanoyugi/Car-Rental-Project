import { IsString, IsNumber, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsIn(['MANUAL'])
  method: string;
}

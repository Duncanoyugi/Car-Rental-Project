import { IsEnum } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma';



export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, { message: 'Invalid booking status' })
  status: BookingStatus;
}

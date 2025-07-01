import { IsInt, IsString, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  vehicleId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}

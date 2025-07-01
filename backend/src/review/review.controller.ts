import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') reviewId: string,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(req.user.id, reviewId, dto);
  }

  @Delete(':id')
  delete(@Param('id') reviewId: string, @Req() req: RequestWithUser) {
    return this.reviewService.deleteReview(req.user.id, reviewId);
  }

  @Get('my')
  getMyReviews(@Req() req: RequestWithUser) {
    return this.reviewService.getMyReviews(req.user.id);
  }

  @Get('vehicle/:vehicleId')
  getVehicleReviews(@Param('vehicleId') vehicleId: string) {
    return this.reviewService.getVehicleReviews(vehicleId);
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { IReview } from 'src/interfaces/review.interface';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto): Promise<IReview> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        userId,
        vehicleId: dto.vehicleId,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      throw new ForbiddenException('You can only review a vehicle after completing a booking.');
    }

    const review = await this.prisma.review.create({
      data: {
        ...dto,
        userId,
      },
    });

    return this.mapToInterface(review);
  }

  async updateReview(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<IReview> {
    const existing = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing || existing.userId !== userId) {
      throw new ForbiddenException('You can only update your own review.');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });

    return this.mapToInterface(updated);
  }

  async deleteReview(userId: string, reviewId: string): Promise<{ message: string }> {
    const existing = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing || existing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own review.');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted successfully.' };
  }

  async getMyReviews(userId: string): Promise<IReview[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => this.mapToInterface(r));
  }

  async getVehicleReviews(vehicleId: string): Promise<IReview[]> {
    const reviews = await this.prisma.review.findMany({
      where: { vehicleId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      vehicleId: r.vehicleId,
      userId: r.userId,
      createdAt: r.createdAt.toISOString(),
      user: {
        fullName: r.user.fullName,
        profileImage: r.user.profileImage,
      },
    }));
  }

  private mapToInterface(review: any): IReview {
    return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        vehicleId: review.vehicleId,
        userId: review.userId,
        createdAt: review.createdAt.toISOString(),
        user: {
            fullName: review.user.fullName,
            profileImage: review.user.profileImage,
        },
    };

  }
}

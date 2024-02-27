import { Controller } from '@nestjs/common';
import { ReviewService } from '../service/review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}

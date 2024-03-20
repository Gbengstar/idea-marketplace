import { Controller } from '@nestjs/common';
import { WishListService } from './wish-list.service';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}
}

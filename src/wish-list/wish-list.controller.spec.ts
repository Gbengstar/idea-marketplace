import { Test, TestingModule } from '@nestjs/testing';
import { WishListController } from './wish-list.controller';
import { WishListService } from './wish-list.service';

describe('WishListController', () => {
  let controller: WishListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishListController],
      providers: [WishListService],
    }).compile();

    controller = module.get<WishListController>(WishListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

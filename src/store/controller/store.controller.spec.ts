import { SearchStoreDto } from './../dto/store.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { CreateStoreGuard, UpdateStoreGuard } from '../guard/store.guard';
import { StoreService } from '../service/store.service';
import { Store } from '../model/store.model';
import { BusinessHoursEnum } from '../enum/store.enum';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';

describe('StoreController', () => {
  let controller: StoreController;

  const store: Store = {
    account: '65f3615a810b530daec67519',
    photo:
      'https://tino-bucket.s3.amazonaws.com/65f3615a810b530daec67519/660f9d8e02b707384e87dea8',
    businessName: 'Holland Wears Depot',
    description: 'All form of wears resides here',
    website: 'google.com',
    languages: ['English', 'Yoruba'],
    locations: [
      {
        storeName: 'Shop Alpha',
        region: 'Lekki',
        address: '152 lekki-Epe express way, Lekki',
        workingDays: 'Mon-Fri',
        businessHours: {
          from: BusinessHoursEnum.EightAM,
          to: BusinessHoursEnum.TenPM,
        },
      },
      {
        storeName: 'Shop Beta',
        region: 'Arena',
        address: 'Shop 121 Arena, Oshodi',
        workingDays: 'Mon-Fri',
        businessHours: {
          from: BusinessHoursEnum.EightAM,
          to: BusinessHoursEnum.TenPM,
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
    })
      .useMocker((token) => {
        if (token === ViewEventGuard) return true;
      })
      .overrideGuard(ViewEventGuard)
      .useValue(true)
      .overrideGuard(CreateStoreGuard)
      .useValue(true)
      .overrideGuard(UpdateStoreGuard)
      .useValue(true)
      .useMocker((token) => {
        if (token === StoreService) {
          return {
            findOne: jest.fn(() => new Promise((resolve) => resolve(store))),
            paginatedResult: jest.fn(
              () => new Promise((resolve) => resolve([store])),
            ),
          };
        }
      })
      .compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStore handler', () => {
    it('should be defined', () => {
      expect(controller.getStore).toBeDefined();
    });

    it('should find one store', async () => {
      expect(
        await controller.getStore({
          id: '65f3615a810b530daec67519',
          email: '',
          role: RolesEnum.VENDOR,
        }),
      ).toMatchObject(store);
    });
  });

  describe('landingPage handler', () => {
    it('should be defined', () => {
      expect(controller.landingPage).toBeDefined();
    });

    it('should find stores', async () => {
      const filter: SearchStoreDto = { id: '', page: 1, limit: 5 };
      expect(await controller.landingPage(filter)).toMatchObject([store]);
    });
  });
});

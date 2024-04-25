import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  addStoreLocationValidator,
  createStoreValidator,
  updateStoreValidator,
} from '../validator/store.validator';
import { Store, StoreDocument } from '../model/store.model';
import {
  CreateStoreGuard,
  StoreLocationGuard,
  UpdateStoreGuard,
} from '../guard/store.guard';
import { SearchStoreDto } from '../dto/store.dto';
import { FilterQuery, PipelineStage } from 'mongoose';
import {
  keywordSearchValidator,
  landingPageSearchValidator,
} from '../../../libs/utils/src/validator/search.validator';
import { KeywordPaginatedSearchDto } from '../../../libs/utils/src/dto/search.dto';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';
import { FollowService } from '../../follow/service/follow.service';
import { Location, LocationDocument } from '../schema/location.schema';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';

@Controller('store')
export class StoreController {
  private readonly logger = new Logger(StoreController.name);
  constructor(
    private readonly storeService: StoreService,
    private readonly followService: FollowService,
  ) {}

  @Get()
  async getStore(@TokenDecorator() token: TokenDataDto) {
    const store = await this.storeService.findOne({ account: token.id }, [
      { path: 'account' },
    ]);

    if (store) return store;
    throw new NotFoundException('store not found');
  }

  @Get('landing-page')
  @ViewResource(ResourceEnum.Store)
  @UseGuards(ViewEventGuard)
  async landingPage(
    @TokenDecorator() token: TokenDataDto,
    @Query(new ObjectValidationPipe(landingPageSearchValidator))
    { page, limit, ...query }: SearchStoreDto,
  ) {
    const filter: FilterQuery<Store> = {};
    if ('id' in query) filter._id = query.id;
    const [stores, follow] = await Promise.all([
      this.storeService.paginatedResult<StoreDocument>(
        { page, limit },
        filter,
        {},
      ),
      this.followService.followingStoreIds(token?.id),
    ]);

    if (!(token || stores[0] || follow[0])) return stores;

    for (const store of stores.foundItems) {
      store.follow = follow.includes(store._id.toString());
    }

    return stores;
  }

  @Get('search')
  SearchStore(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { businessName: regexQuery(keyword) },
            { description: regexQuery(keyword) },
          ],
        },
      },
    ];

    return this.storeService.aggregatePagination(paginate, pipeline, {
      createdAt: -1,
    });
  }

  @Post()
  @UseGuards(CreateStoreGuard)
  createStore(
    @TokenDecorator() token: TokenDataDto,
    @Body(new ObjectValidationPipe(createStoreValidator)) storeData: Store,
  ) {
    storeData.account = token.id;
    return this.storeService.create(storeData);
  }

  @Patch()
  @UseGuards(UpdateStoreGuard)
  updateStore(
    @TokenDecorator() token: TokenDataDto,
    @Body(new ObjectValidationPipe(updateStoreValidator)) storeData: Store,
  ) {
    storeData.account = token.id;
    return this.storeService.updateStore(storeData);
  }

  @Post('location')
  @UseGuards(StoreLocationGuard)
  async addStoreLocation(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Body(new ObjectValidationPipe(addStoreLocationValidator))
    location: Location,
  ) {
    return this.storeService.model.findOneAndUpdate(
      { account },
      { $push: { locations: location } },
      { new: true },
    );
  }

  @Patch('location/:id')
  @UseGuards(StoreLocationGuard)
  async updateStoreLocation(
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @TokenDecorator() { id: account }: TokenDataDto,
    @Body(new ObjectValidationPipe(addStoreLocationValidator))
    updatedLocation: Location,
  ) {
    const store = await this.storeService.model.findOne({ account });
    store.locations = store.locations.map((location: LocationDocument) => {
      if (location._id.toString() === id) {
        this.logger.debug('found');
        return updatedLocation;
      }
      return location;
    });

    return store.save();
  }

  @Delete('location/:id')
  @UseGuards(StoreLocationGuard)
  async deleteStoreLocation(
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    const store = await this.storeService.model.findOne({ account });
    store.locations = store.locations.filter(
      (location: LocationDocument) => location._id.toString() !== id,
    );

    return store.save();
  }
}

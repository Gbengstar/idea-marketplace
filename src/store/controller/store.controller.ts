import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createStoreValidator,
  updateStoreValidator,
} from '../validator/store.validator';
import { Store } from '../model/store.model';
import { CreateStoreGuard, UpdateStoreGuard } from '../guard/store.guard';
import { SearchStoreDto } from '../dto/store.dto';
import { FilterQuery, PipelineStage } from 'mongoose';
import {
  keywordSearchValidator,
  landingPageSearchValidator,
} from '../../../libs/utils/src/validator/search.validator';
import { KeywordPaginatedSearchDto } from '../../../libs/utils/src/dto/search.dto';

@Controller('store')
export class StoreController {
  private readonly logger = new Logger(StoreController.name);
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getStore(@TokenDecorator() token: TokenDataDto) {
    return this.storeService.findOne({ account: token.id }, [
      { path: 'account' },
    ]);
  }

  @Get('landing-page')
  landingPage(
    @Query(new ObjectValidationPipe(landingPageSearchValidator))
    { page, limit, ...query }: SearchStoreDto,
  ) {
    const filter: FilterQuery<Store> = {};
    if ('id' in query) filter._id = query.id;
    return this.storeService.paginatedResult({ page, limit }, filter, {});
  }

  @Get('search')
  SearchStore(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const escapedText = keyword.replace(/[-\/\\^$*+?.():|{}\[\]]/g, '\\$&');
    this.logger.log({ escapedText });
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { businessName: { $regex: escapedText, $options: 'i' } },
            { description: { $regex: escapedText, $options: 'i' } },
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
    this.logger.log({ storeData });
    return this.storeService.updateStore(storeData);
  }
}

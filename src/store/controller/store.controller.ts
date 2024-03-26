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
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createStoreValidator,
  updateStoreValidator,
} from '../validator/store.validator';
import { Store } from '../model/store.model';
import { CreateStoreGuard, UpdateStoreGuard } from '../guard/store.guard';

import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';

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
    @Query(new ObjectValidationPipe(paginationValidator))
    paginate: PaginationDto,
  ) {
    return this.storeService.paginatedResult(paginate, {}, {});
  }

  @Get('search')
  searchStore(
    @Query('key', new StringValidationPipe(stringValidator)) key: string,
  ) {
    const path = ['businessName', 'description'];
    return this.storeService.atlasSearch(key, path);
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

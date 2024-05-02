import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TalentService } from '../service/talent.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { searchAdsValidator } from '../../ads/validator/ads.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Talent } from '../model/talent.model';
import { keywordSearchValidator } from '../../../libs/utils/src/validator/search.validator';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../../../libs/utils/src/dto/search.dto';
import { FilterQuery, PipelineStage } from 'mongoose';
import {
  createTalentValidator,
  talentLandingPageSearchValidator,
} from '../validator/talent.validator';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import {
  querySort,
  regexQuery,
} from '../../../libs/utils/src/general/function/general.function';

@Controller('talent')
export class TalentController {
  private readonly sortOrder = querySort();
  constructor(private readonly talentService: TalentService) {}

  @Get()
  getTalents(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { page, limit }: PaginationDto,
  ) {
    return this.talentService.paginatedResult({ page, limit }, { account });
  }

  @Post()
  createTalent(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Body(new ObjectValidationPipe(createTalentValidator)) talent: Talent,
  ) {
    talent.account = account;
    return this.talentService.create(talent);
  }

  @Get('landing-page')
  @ViewResource(ResourceEnum.Talent)
  @UseGuards(ViewEventGuard)
  landingPage(
    @Query(new ObjectValidationPipe(talentLandingPageSearchValidator))
    { page, limit, ...query }: LandingPagePaginatedSearchDto<Talent>,
  ) {
    const filter: FilterQuery<Talent> = {};
    if ('id' in query) filter._id = query.id;
    if ('name' in query) {
      filter.name = regexQuery(query.name);
    }
    if ('location' in query) {
      filter.location = regexQuery(query.location);
    }

    return this.talentService.paginatedResult(
      { page, limit },
      filter,
      this.sortOrder,
      [{ path: 'account', select: 'verified whatsapp' }],
    );
  }

  @Get('search')
  SearchTalent(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { description: regexQuery(keyword) },
            { name: regexQuery(keyword) },
          ],
        },
      },
    ];

    return this.talentService.aggregatePagination(
      paginate,
      pipeline,
      this.sortOrder,
    );
  }
}

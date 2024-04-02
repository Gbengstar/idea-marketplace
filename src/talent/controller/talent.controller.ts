import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TalentService } from '../service/talent.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { searchAdsValidator } from '../../ads/validator/ads.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Talent } from '../model/talent.model';
import {
  keywordSearchValidator,
  landingPageSearchValidator,
} from '../../../libs/utils/src/validator/search.validator';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../../../libs/utils/src/dto/search.dto';
import { FilterQuery, PipelineStage } from 'mongoose';

@Controller('talent')
export class TalentController {
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
    @Body() talent: Talent,
  ) {
    talent.account = account;
    return this.talentService.create(talent);
  }

  @Get('landing-page')
  landingPage(
    @Query(new ObjectValidationPipe(landingPageSearchValidator))
    { page, limit, ...query }: LandingPagePaginatedSearchDto,
  ) {
    const filter: FilterQuery<Talent> = {};
    if ('id' in query) filter._id = query.id;
    return this.talentService.paginatedResult({ page, limit }, filter, {});
  }

  @Get('search')
  SearchTalent(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const escapedText = keyword.replace(/[-\/\\^$*+?.():|{}\[\]]/g, '\\$&');
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { description: { $regex: escapedText, $options: 'i' } },
            { name: { $regex: escapedText, $options: 'i' } },
          ],
        },
      },
    ];

    return this.talentService.aggregatePagination(paginate, pipeline, {
      createdAt: -1,
    });
  }
}

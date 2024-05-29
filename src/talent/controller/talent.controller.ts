import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TalentService } from '../service/talent.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  availableAdsValidator,
  searchAdsValidator,
} from '../../ads/validator/ads.validator';
import { Talent } from '../model/talent.model';
import { keywordSearchValidator } from '../../../libs/utils/src/validator/search.validator';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../../../libs/utils/src/dto/search.dto';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import {
  createTalentValidator,
  talentLandingPageSearchValidator,
  updateTalentValidator,
} from '../validator/talent.validator';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import {
  querySort,
  regexQuery,
} from '../../../libs/utils/src/general/function/general.function';
import { AvailableAdsDto, SearchAdsDto } from '../../ads/dto/ads.dto';
import {
  addViewsAndContactFields,
  contactCountPipelineStage,
  fillViewsAndCounts,
  viewCountsPipelineStage,
} from '../../ads/pipeline/ads.pipeline';
import { StatusEnum } from '../../../libs/utils/src/enum/status.enum';
import { idsValidator } from '../../../libs/utils/src/validator/custom.validator';

@Controller('talent')
export class TalentController {
  private readonly sortOrder = querySort();
  constructor(private readonly talentService: TalentService) {}

  @Get()
  getTalents(
    @TokenDecorator() { id }: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { page, limit, keyword }: SearchAdsDto,
  ) {
    const match: PipelineStage.Match = {
      $match: { account: new Types.ObjectId(id) },
    };

    if (keyword) {
      match.$match['$or'] = [
        { description: regexQuery(keyword) },
        { name: regexQuery(keyword) },
        { mainSkill: regexQuery(keyword) },
        { location: regexQuery(keyword) },
        { yearsOfExperience: regexQuery(keyword) },
      ];
    }

    const project = {
      $project: {
        viewsCount: '$viewsCount.viewsCount',
        contactsCount: '$contactsCount.contactsCount',
        name: 1,
        mainSkill: 1,
        yearsOfExperience: 1,
        publishedDate: 1,
        status: 1,
      },
    };

    const filter: PipelineStage[] = [
      match,
      viewCountsPipelineStage,
      contactCountPipelineStage,
      addViewsAndContactFields,
      project,
      fillViewsAndCounts,
    ];

    return this.talentService.aggregatePagination({ page, limit }, filter, {
      createdAt: -1,
    });
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

  @Patch('/:id')
  UpdateTalent(
    @Param('id') _id: string,
    @Body(new ObjectValidationPipe(updateTalentValidator)) talent: Talent,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    return this.talentService.findOneAndUpdateOrErrorOut(
      { _id, account: id },
      talent,
    );
  }

  @Get('/:id')
  oneTalent(@Param('id') _id: string, @TokenDecorator() { id }: TokenDataDto) {
    return this.talentService.findOneOrErrorOut({ _id, account: id });
  }

  @Post('/available')
  async availableUpdate(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Body(new ObjectValidationPipe(availableAdsValidator))
    { available, ids }: AvailableAdsDto,
  ) {
    const status = available ? StatusEnum.Active : StatusEnum.Unavailable;

    return this.talentService.updateMany(
      { _id: { $in: ids }, account },
      { $set: { status } },
    );
  }

  @Delete()
  async delete(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(idsValidator))
    { ids }: { ids: string[] },
  ) {
    return this.talentService.deleteMany({ _id: { $in: ids }, account });
  }
}

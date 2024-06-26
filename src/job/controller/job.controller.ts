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
import { JobService } from '../service/job.service';
import { ProfileService } from '../service/profile.service';
import { Profile } from '../model/profile.model';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { Job } from '../model/job.model';
import {
  ArrayValidationPipe,
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createJobValidator,
  jobLandingPageSearchValidator,
  jobSearchValidator,
  updateJobValidator,
} from '../validator/job.validator';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { arrayValidator } from '../../../libs/utils/src/validator/custom.validator';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../../../libs/utils/src/dto/search.dto';
import { keywordSearchValidator } from '../../../libs/utils/src/validator/search.validator';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { ViewEventGuard } from '../../view/guard/guard.view';
import {
  querySort,
  regexQuery,
} from '../../../libs/utils/src/general/function/general.function';
import {
  addViewsAndContactFields,
  contactCountPipelineStage,
  fillViewsAndCounts,
  viewCountsPipelineStage,
} from '../../ads/pipeline/ads.pipeline';
import { JobSearchDto } from '../dto/job.dto';
import { AvailableAdsDto } from '../../ads/dto/ads.dto';
import { availableAdsValidator } from '../../ads/validator/ads.validator';
import { ResourceStatusEnum } from '../../../libs/utils/src/dto/resource.dto';

@Controller('job')
export class JobController {
  private readonly sortOrder = querySort();
  constructor(
    private readonly jobService: JobService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('profile')
  createProfile(
    @Body() profile: Profile,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    profile.account = id;
    return this.profileService.create(profile);
  }

  @Get('profile')
  getProfile(@TokenDecorator() { id: account }: TokenDataDto) {
    return this.profileService.findOne({ account });
  }

  @Patch('profile')
  updateProfile(
    @Body() profile: Profile,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.profileService.findOneAndUpdateOrErrorOut({ account }, profile);
  }

  @Post()
  async createJob(
    @Body(new ObjectValidationPipe(createJobValidator)) job: Job,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    const profile = await this.profileService.findOneOrErrorOut({ account });
    job.account = account;
    job.profile = profile._id.toString();

    return this.jobService.create(job);
  }

  @Get('account-search')
  accountSearchJobs(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          account: new Types.ObjectId(account),
          $or: [
            { jobTitle: regexQuery(keyword) },
            { description: regexQuery(keyword) },
            { location: regexQuery(keyword) },
          ],
        },
      },
    ];

    return this.jobService.aggregatePagination(
      paginate,
      pipeline,
      this.sortOrder,
    );
  }

  @Get('landing-page')
  @ViewResource(ResourceEnum.Job)
  @UseGuards(ViewEventGuard)
  landingPageSearchJobs(
    @Query(new ObjectValidationPipe(jobLandingPageSearchValidator))
    { page, limit, ...query }: LandingPagePaginatedSearchDto<Job>,
  ) {
    const filter: FilterQuery<Job> = {};

    if ('id' in query) filter._id = new Types.ObjectId(query.id);
    if ('jobTitle' in query) filter.jobTitle = regexQuery(query.jobTitle);
    if ('locationType' in query) filter.locationType = query.locationType;
    if ('jobType' in query) filter.jobType = query.jobType;

    const pipeline: PipelineStage[] = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'profiles',
          foreignField: '_id',
          localField: 'profile',
          as: 'profile',
        },
      },
    ];

    return this.jobService.aggregatePagination(
      { page, limit },
      pipeline,
      this.sortOrder,
    );
  }

  @Get('search')
  SearchJobs(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { jobTitle: regexQuery(keyword) },
            { description: regexQuery(keyword) },
            { location: regexQuery(keyword) },
          ],
        },
      },
    ];

    return this.jobService.aggregatePagination(paginate, pipeline, {
      createdAt: -1,
    });
  }

  @Get()
  getJobs(
    @TokenDecorator() { id }: TokenDataDto,
    @Query(new ObjectValidationPipe(jobSearchValidator))
    { keyword, ...paginate }: JobSearchDto,
  ) {
    const match: PipelineStage.Match = {
      $match: { account: new Types.ObjectId(id) },
    };

    if (keyword) {
      match.$match['$or'] = [
        { locationType: regexQuery(keyword) },
        { jobTitle: regexQuery(keyword) },
        { status: regexQuery(keyword) },
        { jobType: regexQuery(keyword) },
      ];
    }

    const project = {
      $project: {
        viewsCount: '$viewsCount.viewsCount',
        contactsCount: '$contactsCount.contactsCount',
        jobTitle: 1,
        salaryRange: 1,
        locationType: 1,
        applicationUrl: 1,
        status: 1,
        jobType: 1,
        expirationDate: 1,
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

    return this.jobService.aggregatePagination(paginate, filter, {
      createdAt: -1,
    });
  }

  @Post('/available')
  async availableUpdate(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Body(new ObjectValidationPipe(availableAdsValidator))
    { available, ids }: AvailableAdsDto,
  ) {
    const status = available
      ? ResourceStatusEnum.Published
      : ResourceStatusEnum.Unavailable;

    return this.jobService.updateMany(
      { _id: { $in: ids }, account },
      { $set: { status } },
    );
  }

  @Patch('/:id')
  updateJob(
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @Body(new ObjectValidationPipe(updateJobValidator)) job: Job,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.jobService.findOneAndUpdateOrErrorOut(
      { _id: id, account },
      job,
    );
  }

  @Get('/:id')
  oneJob(
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.jobService.findOneOrErrorOut({ _id: id, account });
  }

  @Delete()
  deleteJobs(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(
      'ids',
      new ArrayValidationPipe(
        arrayValidator.items(objectIdValidator.required()),
      ),
    )
    ids: string[],
  ) {
    return this.jobService.deleteMany({ account, _id: { $in: ids } });
  }
}

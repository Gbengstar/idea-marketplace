import {
  Body,
  Controller,
  Delete,
  Get,
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
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import {
  createJobValidator,
  updateJobValidator,
} from '../validator/job.validator';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { arrayValidator } from '../../../libs/utils/src/validator/custom.validator';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../../../libs/utils/src/dto/search.dto';
import {
  keywordSearchValidator,
  landingPageSearchValidator,
} from '../../../libs/utils/src/validator/search.validator';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { ViewEventGuard } from '../../view/guard/guard.view';

@Controller('job')
export class JobController {
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
    const escapedText = keyword.replace(/[-\/\\^$*+?.():|{}\[\]]/g, '\\$&');
    const pipeline: PipelineStage[] = [
      {
        $match: {
          account: new Types.ObjectId(account),
          $or: [
            { jobTitle: { $regex: escapedText, $options: 'i' } },
            { description: { $regex: escapedText, $options: 'i' } },
            { location: { $regex: escapedText, $options: 'i' } },
          ],
        },
      },
    ];

    return this.jobService.aggregatePagination(paginate, pipeline, {
      createdAt: -1,
    });
  }

  @Get('landing-page')
  @ViewResource(ResourceEnum.Job)
  @UseGuards(ViewEventGuard)
  landingPageSearchJobs(
    @Query(new ObjectValidationPipe(landingPageSearchValidator))
    { page, limit, ...query }: LandingPagePaginatedSearchDto,
  ) {
    const filter: FilterQuery<Job> = {};

    if ('id' in query) filter._id = new Types.ObjectId(query.id);

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

    return this.jobService.aggregatePagination({ page, limit }, pipeline, {
      createdAt: -1,
    });
  }

  @Get('search')
  SearchJobs(
    @Query(new ObjectValidationPipe(keywordSearchValidator))
    { keyword, ...paginate }: KeywordPaginatedSearchDto,
  ) {
    const escapedText = keyword.replace(/[-\/\\^$*+?.():|{}\[\]]/g, '\\$&');
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { jobTitle: { $regex: escapedText, $options: 'i' } },
            { description: { $regex: escapedText, $options: 'i' } },
            { location: { $regex: escapedText, $options: 'i' } },
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
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(paginationValidator))
    paginate: PaginationDto,
  ) {
    return this.jobService.paginatedResult(
      paginate,
      { account },
      { createdAt: -1 },
      [{ path: 'profile' }],
    );
  }

  @Patch()
  updateJob(
    @Query('id', new StringValidationPipe(objectIdValidator)) id: string,
    @Body(new ObjectValidationPipe(updateJobValidator)) job: Job,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.jobService.findOneAndUpdateOrErrorOut(
      { _id: id, account },
      job,
    );
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

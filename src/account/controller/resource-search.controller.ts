import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AdsService } from '../../ads/service/ads.service';
import { TalentService } from '../../talent/service/talent.service';
import { JobService } from '../../job/service/job.service';
import { StoreService } from '../../store/service/store.service';
import { StringValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';

@Controller('search')
export class ResourceSearchController {
  private readonly logger = new Logger(ResourceSearchController.name);

  constructor(
    private readonly adsService: AdsService,
    private readonly talentService: TalentService,
    private readonly jobService: JobService,
    private readonly storeService: StoreService,
  ) {}

  @Get()
  async search(
    @Query('keyword', new StringValidationPipe(stringValidator.required()))
    keyword: string,
  ) {
    const path = ['title', 'description', 'brandName', 'store'];
    const count = { $count: 'count' };

    const adsSearch = this.adsService.aggregate([
      {
        $search: {
          text: {
            query: keyword,
            path,
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      count,
    ]);

    const talentSearch = this.talentService.aggregate([
      {
        $match: {
          $or: [
            { description: regexQuery(keyword) },
            { name: regexQuery(keyword) },
          ],
        },
      },
      count,
    ]);

    const jobSearch = this.jobService.aggregate([
      {
        $match: {
          $or: [
            { jobTitle: regexQuery(keyword) },
            { description: regexQuery(keyword) },
            { location: regexQuery(keyword) },
          ],
        },
      },
      count,
    ]);

    const storeSearch = this.storeService.aggregate([
      {
        $match: {
          $or: [
            { businessName: regexQuery(keyword) },
            { description: regexQuery(keyword) },
          ],
        },
      },
      count,
    ]);

    const p = Promise.all([adsSearch, talentSearch, jobSearch, storeSearch]);
    const [[ads], [talent], [job], [store]] = await p;
    return {
      ads: ads?.count ?? 0,
      talent: talent?.count ?? 0,
      job: job?.count ?? 0,
      store: store?.count ?? 0,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Talent } from '../model/talent.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TalentService extends BaseService<Talent> {
  private readonly logger = new Logger(TalentService.name);
  constructor(
    @InjectModel(Talent.name) private readonly TalentModel: Model<Talent>,
  ) {
    super(TalentModel);
  }
}

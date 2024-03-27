import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../model/profile.model';

@Injectable()
export class ProfileService extends BaseService<Profile> {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectModel(Profile.name) private readonly ProfileModel: Model<Profile>,
  ) {
    super(ProfileModel);
  }
}

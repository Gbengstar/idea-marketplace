import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Comment } from '../model/comment.model';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: Model<Comment>,
  ) {
    super(CommentModel);
  }
}

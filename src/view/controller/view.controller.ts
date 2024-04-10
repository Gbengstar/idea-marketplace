import { Controller, Get, Query } from '@nestjs/common';
import { ViewService } from '../service/view.service';
import { StringValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { View } from '../model/view.model';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get()
  getView(
    @Query('item', new StringValidationPipe(objectIdValidator.required()))
    item: string,
  ) {
    return this.viewService.model.countDocuments({ item });
  }

  @Get('analytics')
  getViewAnalytics(
    @TokenDecorator() { id }: TokenDataDto,
    @Query('item', new StringValidationPipe(objectIdValidator))
    item: string,
  ) {
    const filter: FilterQuery<View> = { account: new Types.ObjectId(id) };
    if (item) filter.item = new Types.ObjectId(item);
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $project: {
          date: {
            $dateToParts: { date: '$timestamp' },
          },
          item: 1,
        },
      },
      {
        $group: {
          _id: {
            date: {
              year: '$date.year',
              month: '$date.month',
              day: '$date.day',
            },
          },
          count: { $count: {} },
        },
      },
    ];
    return this.viewService.model.aggregate(pipeline);
  }
}

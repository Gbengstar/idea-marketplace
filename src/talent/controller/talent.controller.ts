import { Controller } from '@nestjs/common';
import { TalentService } from '../service/talent.service';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}
}

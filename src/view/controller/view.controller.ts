import { Controller } from '@nestjs/common';
import { ViewService } from '../service/view.service';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}
}

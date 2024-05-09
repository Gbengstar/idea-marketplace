import { Controller, Get } from '@nestjs/common';
import { ConfigurationService } from '../service/configuration.service';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  config(@TokenDecorator() { id }: TokenDataDto) {
    return this.configurationService.findOrCreateConfiguration(id);
  }
}

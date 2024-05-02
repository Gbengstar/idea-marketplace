import { SetMetadata } from '@nestjs/common';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

export const ViewResource = (resource: ResourceEnum) =>
  SetMetadata('resource', resource);

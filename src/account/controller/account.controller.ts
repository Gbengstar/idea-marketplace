import { FileUploadService } from './../../../libs/utils/src/file-upload/service/file-upload.service';
import { TokenDataDto } from './../../../libs/utils/src/token/dto/token.dto';
import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { updateAccountDetails } from '../validator/account.validator';
import { Account } from '../model/account.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SharpService } from '../../../libs/utils/src/file-upload/service/sharp.service';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly fileUploadService: FileUploadService,
    private readonly sharpService: SharpService,
  ) {}

  @Get()
  async getAccount(@TokenDecorator() { id }: TokenDataDto) {
    return this.accountService.findById(id);
  }

  @Patch()
  async updateAccount(
    @Body(new ObjectValidationPipe(updateAccountDetails)) account: Account,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    return this.accountService.updateByIdErrorOut(id, account);
  }

  @Post('upload-files')
  @UseInterceptors(
    FilesInterceptor('file[]', 6, {
      limits: { fieldSize: 6, fileSize: 5000000 },
    }),
  )
  async fileUpload(
    @Body(new ObjectValidationPipe(updateAccountDetails)) account: Account,
    @TokenDecorator() { id }: TokenDataDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const width = 600;
    for (const file of files) {
      const metadata = await this.sharpService.metadata(file.buffer);
      const { height } = this.sharpService.calculateNewHeight(
        metadata.height,
        metadata.width,
        width,
      );
      const buffer = await this.sharpService.resize(
        { width, height, fit: 'cover' },
        file.buffer,
      );

      file.buffer = await this.sharpService.compositeWaterMarkImage(buffer);
    }
    return this.fileUploadService.fileUploadMany(files, id);
  }

  @Post('open-files-upload')
  @UseInterceptors(
    FilesInterceptor('file[]', 6, {
      limits: { fieldSize: 6, fileSize: 5000000 },
    }),
  )
  async freeFileUpload(
    @Body(new ObjectValidationPipe(updateAccountDetails)) account: Account,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.fileUploadService.fileUploadMany(files, 'assets');
  }
}

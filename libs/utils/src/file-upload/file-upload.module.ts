import { Module } from '@nestjs/common';
import { FileUploadService } from './service/file-upload.service';
import { SharpService } from './service/sharp.service';

@Module({
  providers: [FileUploadService, SharpService],
  exports: [FileUploadService, SharpService],
})
export class FileUploadModule {}

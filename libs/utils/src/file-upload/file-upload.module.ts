import { Module } from '@nestjs/common';
import { FileUploadService } from './service/file-upload.service';

@Module({
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}

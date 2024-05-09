import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileUploadService {
  private readonly bucket: string;

  private readonly s3Prefix: string;

  private readonly s3 = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
    this.s3Prefix = `https://${this.bucket}.s3.eu-north-1.amazonaws.com`; //`https://s3.amazonaws.com/${this.bucket}`;
  }

  async fileUpload(file: Express.Multer.File, user: string, Key: string) {
    const input = {
      ACL: ObjectCannedACL.public_read,
      Body: file.buffer,
      Bucket: this.bucket,
      Key,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };
    const command = new PutObjectCommand(input);
    await this.s3.send(command);

    return {
      location: `${this.s3Prefix}/${Key}`,
      fileName: file.originalname,
    };
  }

  async fileUploadMany(files: Express.Multer.File[], user: string) {
    const output: { location: string; fileName: string }[] = [];
    const promiseList = [];
    for await (const file of files) {
      const name = file.originalname.trim().replace(/\s+/g, '-');
      const Key = user + '/' + name;
      const awaitingUpload = this.fileUpload(file, user, Key);
      promiseList.push(awaitingUpload);

      output.push({
        location: `${this.s3Prefix}/${Key}`,
        fileName: file.originalname,
      });
    }

    await Promise.all(promiseList);
    return output;
  }

  getImagesLinks(images: { location: string; fileName: string }[]) {
    return images.map((image) => image.location);
  }
}

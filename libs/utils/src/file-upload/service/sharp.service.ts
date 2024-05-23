import { Injectable, Logger } from '@nestjs/common';
import { ResizeOptions, CreateText } from 'sharp';
import * as sharp from 'sharp';
import { Buffer } from 'node:buffer';
import { raw } from '@nestjs/mongoose';

@Injectable()
export class SharpService {
  private readonly logger = new Logger(SharpService.name);

  resize(option: ResizeOptions, image: Buffer) {
    return sharp(image).resize(option).toBuffer();
  }

  metadata(image: Buffer) {
    return sharp(image).metadata();
  }

  calculateNewDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
  ): { width: number; height: number } {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const originalAspectRatio = originalWidth / originalHeight;

    let newWidth = maxWidth;
    let newHeight = Math.round(maxWidth / originalAspectRatio);

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = Math.round(maxHeight * originalAspectRatio);
    }

    return { width: newWidth, height: newHeight };
  }

  calculateNewHeight(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
  ): { height: number } {
    const newHeight = Math.round((maxWidth * originalHeight) / originalWidth);

    return { height: newHeight };
  }

  async createWaterMarkTextImage(watermarkText: string) {
    return sharp({
      text: {
        text: `<span foreground="white" size="34.1pt"><b>Sold on Tino.ng By</b></span>
      <span foreground="white" size="16pt">${watermarkText}</span>`,
        font: 'DM Sans',
        fontfile: __dirname + '/DMSans-Medium.ttf',
        align: 'centre',
        width: 300,
        rgba: true,
      },
    })
      .composite([
        {
          input: Buffer.from([0, 0, 0, 128]),
          raw: {
            width: 1,
            height: 1,
            channels: 4,
          },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .toFormat('png')
      .toBuffer();
  }

  async createWaterMarkImage(image: Buffer, watermarkText: string) {
    return await sharp(image)
      .composite([
        { input: await this.createWaterMarkTextImage(watermarkText) },
      ])
      .toBuffer();
  }

  async processAdsImage(files: Express.Multer.File[], storeName: string) {
    const text = `${storeName}`;
    const width = 600;
    for (const file of files) {
      const metadata = await this.metadata(file.buffer);
      const { height } = this.calculateNewHeight(
        metadata.height,
        metadata.width,
        width,
      );
      const buffer = await this.resize(
        { width, height, fit: 'inside' },
        file.buffer,
      );

      file.buffer = await this.createWaterMarkImage(buffer, text);
    }
    return files;
  }
}

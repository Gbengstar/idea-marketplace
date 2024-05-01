import { Injectable, Logger } from '@nestjs/common';
import { ResizeOptions, CreateText } from 'sharp';
import * as sharp from 'sharp';

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

  async compositeWaterMarkImage(image: Buffer) {
    const text: CreateText = {
      text: '<span foreground="red" size="32pt">HELLO WORLD</span>',
      font: 'Comic Sans',
      fontfile: __dirname + '/COMICSANS.TTF',
      justify: true,
      width: 600,
      rgba: true,
    };

    this.logger.debug({ fontline: text.fontfile });

    return await sharp(image)
      .composite([{ input: { text } }])
      .toBuffer();
  }
}

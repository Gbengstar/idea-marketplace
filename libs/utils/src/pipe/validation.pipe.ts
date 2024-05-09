import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'joi';

import * as Joi from 'joi';

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    try {
      return this.schema.validateAsync(data, {
        stripUnknown: true,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class ArrayValidationPipe implements PipeTransform {
  constructor(private readonly schema: ArraySchema) {}
  async transform(data: any): Promise<any> {
    try {
      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
        convert: false,
      });
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class StringValidationPipe implements PipeTransform {
  constructor(private readonly schema: StringSchema) {}
  async transform(data: string): Promise<string> {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class BooleanValidationPipe implements PipeTransform {
  // constructor(private readonly schema: BooleanSchema) {}
  async transform(data: any): Promise<boolean> {
    try {
      const value = await Joi.boolean().validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class NumberValidationPipe implements PipeTransform {
  constructor(private readonly schema: NumberSchema) {}
  async transform(data: any): Promise<any> {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

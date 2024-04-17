import { SchemaOptions } from '@nestjs/mongoose';

export const dbSchemaOptions: SchemaOptions = {
  id: true,
  versionKey: false,
  timestamps: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.password;
      delete ret.salt;
      delete ret.visible;
      delete ret.secret;
      delete ret.code;
      delete ret.pin;
      delete ret.accountActivated;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.password;
      delete ret.salt;
      delete ret.visible;
      delete ret.secret;
      delete ret.code;
      delete ret.pin;
      delete ret.accountActivated;
      return ret;
    },
  },
};

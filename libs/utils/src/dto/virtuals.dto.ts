import mongoose from 'mongoose';

export class VirtualsDto {
  schema: mongoose.Schema;
  ref: string;
  localField: string;
  foreignField: string;
  populationName: string;
  justOne: boolean;
}

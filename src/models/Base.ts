import mongoose, { Schema, Document } from 'mongoose';

export interface IBase extends Document {
  id: string;
  name: string;
  regionId: string;
  countryId: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  updatedAt: Date;
}

const BaseSchema: Schema = new Schema<IBase>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  regionId: { type: String, required: true },
  countryId: { type: String, required: true },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBase>('Base', BaseSchema);
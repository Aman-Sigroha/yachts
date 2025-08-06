import mongoose, { Schema, Document } from 'mongoose';

export interface IRegion extends Document {
  id: string;
  name: string;
  countryId: string;
  updatedAt: Date;
}

const RegionSchema: Schema = new Schema<IRegion>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  countryId: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRegion>('Region', RegionSchema);
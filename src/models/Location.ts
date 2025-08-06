import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  base: string;
  region: string;
  country: string;
}

const LocationSchema: Schema = new Schema<ILocation>({
  base: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true }
});

export default mongoose.model<ILocation>('Location', LocationSchema);
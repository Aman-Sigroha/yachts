import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  id: string;
  name: string;
  code?: string;
  updatedAt: Date;
}

const CountrySchema: Schema = new Schema<ICountry>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICountry>('Country', CountrySchema);
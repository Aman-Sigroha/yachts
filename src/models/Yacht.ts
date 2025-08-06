import mongoose, { Schema, Document } from 'mongoose';

export interface IYacht extends Document {
  yachtId: string;
  name: string;
  yachtModel: string;
  type: string;
  category: string;
  charterCompany: {
    id: string;
    name: string;
  };
  price: {
    from: number;
    currency: string;
    priceListId: string;
  };
  availability: Array<{
    start: Date;
    end: Date;
  }>;
  location: {
    base: string;
    region: string;
    country: string;
  };
  images: string[];
  videos: string[];
  equipment: string[];
  cabins: number;
  bathrooms: number;
  length: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const YachtSchema: Schema = new Schema<IYacht>({
  yachtId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  yachtModel: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  charterCompany: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  price: {
    from: { type: Number, required: true },
    currency: { type: String, required: true },
    priceListId: { type: String, required: true }
  },
  availability: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    }
  ],
  location: {
    base: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true }
  },
  images: [{ type: String }],
  videos: [{ type: String }],
  equipment: [{ type: String }],
  cabins: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  length: { type: Number, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IYacht>('Yacht', YachtSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceList extends Document {
  priceListId: string;
  name: string;
  currency: string;
  validFrom: Date;
  validTo: Date;
}

const PriceListSchema: Schema = new Schema<IPriceList>({
  priceListId: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true }
});

export default mongoose.model<IPriceList>('PriceList', PriceListSchema);
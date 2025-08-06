import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
  id: string;
  name: string;
  nameTranslations?: Record<string, string>;
  category?: string;
}

const EquipmentSchema: Schema = new Schema<IEquipment>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameTranslations: { type: Object },
  category: { type: String }
});

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);
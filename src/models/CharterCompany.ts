import mongoose, { Schema, Document } from 'mongoose';

export interface ICharterCompany extends Document {
  id: string;
  name: string;
  companyId: string;
  description?: string;
}

const CharterCompanySchema: Schema = new Schema<ICharterCompany>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  companyId: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model<ICharterCompany>('CharterCompany', CharterCompanySchema);
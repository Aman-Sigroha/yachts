import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  description?: string;
}

const CategorySchema: Schema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model<ICategory>('Category', CategorySchema);
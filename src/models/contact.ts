import mongoose, { Schema, Document } from 'mongoose';
import { parseDate } from '../utils/date';

export interface IContact extends Document {
    id: number;
    name: string;
    surname?: string;
    company?: boolean;
    countryId?: number;
    address?: string;
    city?: string;
    zipCode?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    skype?: string;
    vatNr?: string;
    belongsTo?: number;
    disabled?: boolean;
    contactRoleIds?: number[];
    lastModifyTime?: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    surname: String,
    company: Boolean,
    countryId: Number,
    address: String,
    city: String,
    zipCode: String,
    email: String,
    phone: String,
    mobile: String,
    skype: String,
    vatNr: String,
    belongsTo: Number,
    disabled: Boolean,
    contactRoleIds: [Number],
    lastModifyTime: { 
        type: Date,
        set: (v: string) => parseDate(v)
    },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
ContactSchema.index({ id: 1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ belongsTo: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
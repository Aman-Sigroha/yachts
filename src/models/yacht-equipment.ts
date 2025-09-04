import mongoose, { Schema, Document } from 'mongoose';
import { IMultilingualText, MultilingualTextSchema } from './common';

// Yacht Equipment Interface
export interface IYachtEquipment extends Document {
    id: number;
    yachtId: number;
    equipmentId: number;
    name: IMultilingualText;
    category: string;
    subcategory?: string;
    quantity: number;
    price?: number;
    currency?: string;
    isStandard: boolean;
    isOptional: boolean;
    isIncluded: boolean;
    description?: IMultilingualText;
    specifications?: IMultilingualText;
    condition?: string; // new, good, fair, poor
    lastMaintained?: Date;
    notes?: IMultilingualText;
    updatedAt: Date;
}

const YachtEquipmentSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    yachtId: { type: Number, required: true },
    equipmentId: { type: Number, required: true },
    name: { type: MultilingualTextSchema, required: true },
    category: { type: String, required: true },
    subcategory: String,
    quantity: { type: Number, required: true, default: 1 },
    price: Number,
    currency: String,
    isStandard: { type: Boolean, required: true, default: true },
    isOptional: { type: Boolean, required: true, default: false },
    isIncluded: { type: Boolean, required: true, default: true },
    description: MultilingualTextSchema,
    specifications: MultilingualTextSchema,
    condition: String,
    lastMaintained: Date,
    notes: MultilingualTextSchema,
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
YachtEquipmentSchema.index({ yachtId: 1 });
YachtEquipmentSchema.index({ equipmentId: 1 });
YachtEquipmentSchema.index({ category: 1 });
YachtEquipmentSchema.index({ isStandard: 1 });
YachtEquipmentSchema.index({ isOptional: 1 });

export const YachtEquipment = mongoose.model<IYachtEquipment>('YachtEquipment', YachtEquipmentSchema);

// Equipment Categories
export const EQUIPMENT_CATEGORIES = {
    COMFORT: 'Comfort',
    SAFETY: 'Safety',
    NAVIGATION: 'Navigation',
    SAILS: 'Sails',
    DECK: 'Deck',
    GALLEY: 'Galley',
    INTERIOR: 'Interior',
    ENTERTAINMENT: 'Entertainment',
    ELECTRICAL: 'Electrical',
    ENGINE: 'Engine',
    PLUMBING: 'Plumbing',
    OTHER: 'Other'
} as const;

export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[keyof typeof EQUIPMENT_CATEGORIES];

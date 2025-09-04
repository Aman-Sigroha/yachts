import mongoose, { Schema, Document } from 'mongoose';
import { IMultilingualText, MultilingualTextSchema } from './common';

// Yacht Service Interface
export interface IYachtService extends Document {
    id: number;
    yachtId: number;
    serviceId: number;
    name: IMultilingualText;
    description?: IMultilingualText;
    price: number;
    currency: string;
    priceMeasure: string; // per booking, per week, per day, per person, etc.
    isObligatory: boolean;
    isOptional: boolean;
    isIncluded: boolean;
    category: string;
    subcategory?: string;
    availability?: string; // always, on request, seasonal, etc.
    minimumDuration?: number; // minimum days/weeks
    maximumDuration?: number; // maximum days/weeks
    advanceBooking?: number; // days in advance required
    cancellationPolicy?: IMultilingualText;
    terms?: IMultilingualText;
    updatedAt: Date;
}

const YachtServiceSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    yachtId: { type: Number, required: true },
    serviceId: { type: Number, required: true },
    name: { type: MultilingualTextSchema, required: true },
    description: MultilingualTextSchema,
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'EUR' },
    priceMeasure: { type: String, required: true },
    isObligatory: { type: Boolean, required: true, default: false },
    isOptional: { type: Boolean, required: true, default: true },
    isIncluded: { type: Boolean, required: true, default: false },
    category: { type: String, required: true },
    subcategory: String,
    availability: String,
    minimumDuration: Number,
    maximumDuration: Number,
    advanceBooking: Number,
    cancellationPolicy: MultilingualTextSchema,
    terms: MultilingualTextSchema,
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
YachtServiceSchema.index({ yachtId: 1 });
YachtServiceSchema.index({ serviceId: 1 });
YachtServiceSchema.index({ category: 1 });
YachtServiceSchema.index({ isObligatory: 1 });
YachtServiceSchema.index({ isOptional: 1 });
YachtServiceSchema.index({ price: 1 });

export const YachtService = mongoose.model<IYachtService>('YachtService', YachtServiceSchema);

// Service Categories
export const SERVICE_CATEGORIES = {
    CLEANING: 'Cleaning',
    PROVISIONING: 'Provisioning',
    CREW: 'Crew',
    EQUIPMENT: 'Equipment',
    INSURANCE: 'Insurance',
    TRANSPORT: 'Transport',
    PARKING: 'Parking',
    COMMUNICATION: 'Communication',
    MAINTENANCE: 'Maintenance',
    OTHER: 'Other'
} as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];

// Price Measures
export const PRICE_MEASURES = {
    PER_BOOKING: 'per booking',
    PER_WEEK: 'per week',
    PER_DAY: 'per day',
    PER_PERSON: 'per person',
    PER_HOUR: 'per hour',
    FIXED: 'fixed',
    PERCENTAGE: 'percentage'
} as const;

export type PriceMeasure = typeof PRICE_MEASURES[keyof typeof PRICE_MEASURES];

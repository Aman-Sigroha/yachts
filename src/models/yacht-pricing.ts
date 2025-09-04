import mongoose, { Schema, Document } from 'mongoose';

// Yacht Pricing Interface
export interface IYachtPricing extends Document {
    id: number;
    yachtId: number;
    period: string;
    startDate: Date;
    endDate: Date;
    weeklyPrice: number;
    currency: string;
    discount?: number;
    discountType?: string; // percentage, fixed
    earlyBookingDiscount?: number;
    lastMinuteDiscount?: number;
    minimumDuration?: number; // minimum weeks
    maximumDuration?: number; // maximum weeks
    isActive: boolean;
    notes?: string;
    updatedAt: Date;
}

const YachtPricingSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    yachtId: { type: Number, required: true },
    period: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    weeklyPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: 'EUR' },
    discount: Number,
    discountType: String,
    earlyBookingDiscount: Number,
    lastMinuteDiscount: Number,
    minimumDuration: Number,
    maximumDuration: Number,
    isActive: { type: Boolean, required: true, default: true },
    notes: String,
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
YachtPricingSchema.index({ yachtId: 1 });
YachtPricingSchema.index({ startDate: 1, endDate: 1 });
YachtPricingSchema.index({ period: 1 });
YachtPricingSchema.index({ weeklyPrice: 1 });
YachtPricingSchema.index({ isActive: 1 });

export const YachtPricing = mongoose.model<IYachtPricing>('YachtPricing', YachtPricingSchema);

// Pricing Seasons
export const PRICING_SEASONS = {
    LOW: 'Low Season',
    MID: 'Mid Season',
    HIGH: 'High Season',
    PEAK: 'Peak Season',
    WINTER: 'Winter Season',
    SUMMER: 'Summer Season',
    SPRING: 'Spring Season',
    AUTUMN: 'Autumn Season'
} as const;

export type PricingSeason = typeof PRICING_SEASONS[keyof typeof PRICING_SEASONS];

// Discount Types
export const DISCOUNT_TYPES = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
    EARLY_BOOKING: 'early_booking',
    LAST_MINUTE: 'last_minute',
    GROUP: 'group',
    REPEAT: 'repeat_customer'
} as const;

export type DiscountType = typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES];

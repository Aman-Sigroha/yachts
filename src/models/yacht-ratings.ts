import mongoose, { Schema, Document } from 'mongoose';

// Yacht Rating Interface
export interface IYachtRating extends Document {
    id: number;
    yachtId: number;
    reviewerId?: number;
    reviewerName?: string;
    reviewerEmail?: string;
    reviewDate: Date;
    ratings: {
        cleanliness: number;
        equipment: number;
        personalService: number;
        pricePerformance: number;
        recommendation: number;
        overall: number;
    };
    reviewText?: string;
    reviewLanguage?: string;
    isVerified: boolean;
    isPublished: boolean;
    response?: string;
    responseDate?: Date;
    helpfulVotes: number;
    totalVotes: number;
    source: string; // euminia, mysea, internal, etc.
    bookingId?: number;
    updatedAt: Date;
}

const YachtRatingSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    yachtId: { type: Number, required: true },
    reviewerId: Number,
    reviewerName: String,
    reviewerEmail: String,
    reviewDate: { type: Date, required: true, default: Date.now },
    ratings: {
        cleanliness: { type: Number, required: true, min: 1, max: 5 },
        equipment: { type: Number, required: true, min: 1, max: 5 },
        personalService: { type: Number, required: true, min: 1, max: 5 },
        pricePerformance: { type: Number, required: true, min: 1, max: 5 },
        recommendation: { type: Number, required: true, min: 0, max: 100 },
        overall: { type: Number, required: true, min: 1, max: 5 }
    },
    reviewText: String,
    reviewLanguage: { type: String, default: 'en' },
    isVerified: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    response: String,
    responseDate: Date,
    helpfulVotes: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    source: { type: String, required: true, default: 'internal' },
    bookingId: Number,
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
YachtRatingSchema.index({ yachtId: 1 });
YachtRatingSchema.index({ reviewDate: -1 });
YachtRatingSchema.index({ 'ratings.overall': -1 });
YachtRatingSchema.index({ isPublished: 1 });
YachtRatingSchema.index({ source: 1 });
YachtRatingSchema.index({ reviewerId: 1 });

// Virtual for average rating
YachtRatingSchema.virtual('averageRating').get(function() {
    const ratings = this.ratings;
    if (!ratings) return 0;
    return Math.round(((ratings.cleanliness + ratings.equipment + ratings.personalService + ratings.pricePerformance) / 4) * 10) / 10;
});

export const YachtRating = mongoose.model<IYachtRating>('YachtRating', YachtRatingSchema);

// Rating Sources
export const RATING_SOURCES = {
    EUMINIA: 'euminia',
    MYSEA: 'mysea',
    INTERNAL: 'internal',
    BOOKING: 'booking',
    GOOGLE: 'google',
    TRIPADVISOR: 'tripadvisor'
} as const;

export type RatingSource = typeof RATING_SOURCES[keyof typeof RATING_SOURCES];

// Yacht Rating Summary Interface (for aggregated data)
export interface IYachtRatingSummary {
    yachtId: number;
    totalReviews: number;
    averageRatings: {
        cleanliness: number;
        equipment: number;
        personalService: number;
        pricePerformance: number;
        recommendation: number;
        overall: number;
    };
    ratingDistribution: {
        '5': number;
        '4': number;
        '3': number;
        '2': number;
        '1': number;
    };
    lastUpdated: Date;
}

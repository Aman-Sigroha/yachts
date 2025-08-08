import mongoose, { Schema, Document } from 'mongoose';
import { IMultilingualText, MultilingualTextSchema } from './common';

// Yacht Schema
export interface IYacht extends Document {
    id: number;
    name: IMultilingualText;
    charterCompanyId: number;
    builderId: number;
    modelId: number;
    categoryId: number;
    baseId: number;
    length: number;
    cabins: number;
    berths: number;
    wc: number;
    year: number;
    refit?: number;
    draft: number;
    fuelCapacity: number;
    waterCapacity: number;
    enginePower: number;
    engineCount: number;
    engineBuilderId?: number;
    engineBuildYear?: number;
    fuelType?: string;
    sailArea?: number;
    beam: number;
    deposit: number;
    depositWhenInsured?: number;
    mainPictureUrl?: string;
    picturesUrl?: string[];
    description?: IMultilingualText;
    highlights?: IMultilingualText;
    note?: IMultilingualText;
    crewCount?: number;
    crewMembersIds?: number[];
    maxDiscountFromCommission?: number;
    agencyDiscountType?: string;
    isPremium?: boolean;
    onSale?: boolean;
    registrationNumber?: string;
    registrationCertified?: boolean;
    outOfFleetDate?: Date;
    youtubeVideos?: string[];
    vimeoVideos?: string[];
    linkFor360tour?: string;
    yachtTutorialVimeoVideos?: string[];
    yachtTutorialYoutubeVideos?: string[];
    showers?: number;
    showersCrew?: number;
    recommendedPersons?: number;
    fuelConsumption?: number;
    maxSpeed?: number;
    cruisingSpeed?: number;
    updatedAt: Date;
}

const YachtSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    charterCompanyId: { type: Number, required: true },
    builderId: { type: Number, required: true },
    modelId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    baseId: { type: Number, required: true },
    length: { type: Number, required: true },
    cabins: { type: Number, required: true },
    berths: { type: Number, required: true },
    wc: { type: Number, required: true },
    year: { type: Number, required: true },
    refit: Number,
    draft: { type: Number, required: true },
    fuelCapacity: { type: Number, required: true },
    waterCapacity: { type: Number, required: true },
    enginePower: { type: Number, required: true },
    engineCount: { type: Number, required: true },
    engineBuilderId: Number,
    engineBuildYear: Number,
    fuelType: String,
    sailArea: Number,
    beam: { type: Number, required: true },
    deposit: { type: Number, required: true },
    depositWhenInsured: Number,
    mainPictureUrl: String,
    picturesUrl: [String],
    description: MultilingualTextSchema,
    highlights: MultilingualTextSchema,
    note: MultilingualTextSchema,
    crewCount: Number,
    crewMembersIds: [Number],
    maxDiscountFromCommission: Number,
    agencyDiscountType: String,
    isPremium: Boolean,
    onSale: Boolean,
    registrationNumber: String,
    registrationCertified: Boolean,
    outOfFleetDate: Date,
    youtubeVideos: [String],
    vimeoVideos: [String],
    linkFor360tour: String,
    yachtTutorialVimeoVideos: [String],
    yachtTutorialYoutubeVideos: [String],
    showers: Number,
    showersCrew: Number,
    recommendedPersons: Number,
    fuelConsumption: Number,
    maxSpeed: Number,
    cruisingSpeed: Number,
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
YachtSchema.index({ id: 1 });
YachtSchema.index({ charterCompanyId: 1 });
YachtSchema.index({ modelId: 1 });
YachtSchema.index({ categoryId: 1 });
YachtSchema.index({ baseId: 1 });
YachtSchema.index({ length: 1 });
YachtSchema.index({ cabins: 1 });
YachtSchema.index({ berths: 1 });
YachtSchema.index({ year: 1 });
YachtSchema.index({ onSale: 1 });

// YachtModel Schema
export interface IYachtModel extends Document {
    id: number;
    name: IMultilingualText;
    builderId: number;
    virtualLength: number;
    updatedAt: Date;
}

const YachtModelSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    builderId: { type: Number, required: true },
    virtualLength: Number,
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
YachtModelSchema.index({ builderId: 1 });
YachtModelSchema.index({ virtualLength: 1 });

export const Yacht = mongoose.model<IYacht>('Yacht', YachtSchema);
export const YachtModel = mongoose.model<IYachtModel>('YachtModel', YachtModelSchema);
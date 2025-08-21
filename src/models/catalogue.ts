import mongoose, { Schema, Document } from 'mongoose';
import { IMultilingualText, MultilingualTextSchema } from './common';

// Base Schema
export interface IBase extends Document {
    id: number;
    name: IMultilingualText;
    countryId: number;
    regionId: number;
    locationId: number;
    disabled: boolean;
    disabledDate?: Date;
    openBaseDate?: Date;
    closedBaseDate?: Date;
    returnToBaseNote?: IMultilingualText;
    returnToBaseDelayNote?: IMultilingualText;
    companyId: number;
    lat?: number;
    lon?: number;
    checkInTime?: string;
    checkOutTime?: string;
    secondaryBase?: boolean;
    updatedAt: Date;
}

const BaseSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    countryId: { type: Number, required: true },
    regionId: { type: Number, required: true },
    locationId: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
    disabledDate: Date,
    openBaseDate: Date,
    closedBaseDate: Date,
    returnToBaseNote: MultilingualTextSchema,
    returnToBaseDelayNote: MultilingualTextSchema,
    companyId: { type: Number, required: true },
    lat: Number,
    lon: Number,
    checkInTime: String,
    checkOutTime: String,
    secondaryBase: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

// Country Schema
export interface ICountry extends Document {
    id: number;
    name: IMultilingualText;
    code: string;
    code2: string;
    updatedAt: Date;
}

const CountrySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    code: { type: String, required: true },
    code2: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Equipment Schema
export interface IEquipment extends Document {
    id: number;
    name: IMultilingualText;
    categoryId: number;
    updatedAt: Date;
}

const EquipmentSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    categoryId: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// YachtCategory Schema
export interface IYachtCategory extends Document {
    id: number;
    name: IMultilingualText;
    updatedAt: Date;
}

const YachtCategorySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Service Schema
export interface IService extends Document {
    id: number;
    name: IMultilingualText;
    depositInsurance: boolean;
    updatedAt: Date;
}

const ServiceSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    depositInsurance: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

// YachtBuilder Schema
export interface IYachtBuilder extends Document {
    id: number;
    name: IMultilingualText;
    updatedAt: Date;
}

const YachtBuilderSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Region Schema
export interface IRegion extends Document {
    id: number;
    name: IMultilingualText;
    countryId: number;
    updatedAt: Date;
}

const RegionSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    countryId: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Location Schema
export interface ILocation extends Document {
    id: number;
    name: {
        textEN?: string;
        textDE?: string;
        textFR?: string;
        textIT?: string;
        textES?: string;
        textHR?: string;
        textCZ?: string;
        textHU?: string;
        textLT?: string;
        textLV?: string;
        textNL?: string;
        textNO?: string;
        textPL?: string;
        textRU?: string;
        textSE?: string;
        textSI?: string;
        textSK?: string;
        textTR?: string;
    };
    regionId: number;
    countryId: number;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
    id: { type: Number, required: true, unique: true, index: true },
    name: {
        textEN: String,
        textDE: String,
        textFR: String,
        textIT: String,
        textES: String,
        textHR: String,
        textCZ: String,
        textHU: String,
        textLT: String,
        textLV: String,
        textNL: String,
        textNO: String,
        textPL: String,
        textRU: String,
        textSE: String,
        textSI: String,
        textSK: String,
        textTR: String
    },
    regionId: { type: Number, required: true, index: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for region and country
LocationSchema.virtual('region', {
    ref: 'Region',
    localField: 'regionId',
    foreignField: 'id',
    justOne: true
});

LocationSchema.virtual('country', {
    ref: 'Country',
    localField: 'regionId',
    foreignField: 'id',
    justOne: true
});

// Journey Schema for available charter routes
const JourneySchema = new Schema<IJourney>({
    id: { type: Number, required: true, unique: true, index: true },
    yachtId: { type: Number, required: true, index: true },
    baseFromId: { type: Number, required: true, index: true },
    baseToId: { type: Number, required: true, index: true },
    locationFromId: { type: Number, required: true, index: true },
    locationToId: { type: Number, required: true, index: true },
    periodFrom: { type: Date, required: true },
    periodTo: { type: Date, required: true },
    optionTill: { type: Date, required: true },
    reservationStatus: { type: String, required: true },
    agency: { type: String, required: true },
    priceListPrice: { type: Number, required: true },
    agencyPrice: { type: Number },
    clientPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    approved: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for journey details
JourneySchema.virtual('baseFrom', {
    ref: 'Base',
    localField: 'baseFromId',
    foreignField: 'id',
    justOne: true
});

JourneySchema.virtual('baseTo', {
    ref: 'Base',
    localField: 'baseToId',
    foreignField: 'id',
    justOne: true
});

JourneySchema.virtual('locationFrom', {
    ref: 'Location',
    localField: 'locationFromId',
    foreignField: 'id',
    justOne: true
});

JourneySchema.virtual('locationTo', {
    ref: 'Location',
    localField: 'locationToId',
    foreignField: 'id',
    justOne: true
});

JourneySchema.virtual('yacht', {
    ref: 'Yacht',
    localField: 'yachtId',
    foreignField: 'id',
    justOne: true
});

// CharterCompany Schema
export interface ICharterCompany extends Document {
    id: number;
    name: IMultilingualText;
    countryId: number;
    disabled: boolean;
    updatedAt: Date;
}

const CharterCompanySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    countryId: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

// Journey/Routes interface for available charter routes
export interface IJourney {
    id: number;
    yachtId: number;
    baseFromId: number;
    baseToId: number;
    locationFromId: number;
    locationToId: number;
    periodFrom: Date;
    periodTo: Date;
    optionTill: Date;
    reservationStatus: string;
    agency: string;
    priceListPrice: number;
    agencyPrice?: number;
    clientPrice: number;
    currency: string;
    approved: boolean;
    createdAt: Date;
}

// Indexes
// Virtual populate for country
BaseSchema.virtual('country', {
    ref: 'Country',
    localField: 'countryId',
    foreignField: 'id',
    justOne: true
});

// Virtual fields for region and location (can be populated later if models exist)
BaseSchema.virtual('region', {
    ref: 'Region',
    localField: 'regionId',
    foreignField: 'id',
    justOne: true
});

BaseSchema.virtual('location', {
    ref: 'Location',
    localField: 'locationId',
    foreignField: 'id',
    justOne: true
});

BaseSchema.index({ countryId: 1 });
BaseSchema.index({ regionId: 1 });
BaseSchema.index({ locationId: 1 });
BaseSchema.index({ companyId: 1 });
BaseSchema.index({ disabled: 1 });

CountrySchema.index({ code: 1 });
CountrySchema.index({ code2: 1 });

EquipmentSchema.index({ categoryId: 1 });

CharterCompanySchema.index({ countryId: 1 });
CharterCompanySchema.index({ disabled: 1 });

// Region index
RegionSchema.index({ countryId: 1 });

// Virtual populate for Region
RegionSchema.virtual('country', {
    ref: 'Country',
    localField: 'countryId',
    foreignField: 'id',
    justOne: true
});

// Enable virtuals for Base schema
BaseSchema.set('toJSON', { virtuals: true });
BaseSchema.set('toObject', { virtuals: true });

// Enable virtuals for Region schema
RegionSchema.set('toJSON', { virtuals: true });
RegionSchema.set('toObject', { virtuals: true });

export const Base = mongoose.model<IBase>('Base', BaseSchema);
export const Country = mongoose.model<ICountry>('Country', CountrySchema);
export const Equipment = mongoose.model<IEquipment>('Equipment', EquipmentSchema);
export const YachtCategory = mongoose.model<IYachtCategory>('YachtCategory', YachtCategorySchema);
export const Service = mongoose.model<IService>('Service', ServiceSchema);
export const YachtBuilder = mongoose.model<IYachtBuilder>('YachtBuilder', YachtBuilderSchema);
export const CharterCompany = mongoose.model<ICharterCompany>('CharterCompany', CharterCompanySchema);
export const Region = mongoose.model<IRegion>('Region', RegionSchema);
export const Location = mongoose.model<ILocation>('Location', LocationSchema);
export const Journey = mongoose.model<IJourney>('Journey', JourneySchema);
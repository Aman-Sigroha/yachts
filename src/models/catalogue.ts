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

// Indexes
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

export const Base = mongoose.model<IBase>('Base', BaseSchema);
export const Country = mongoose.model<ICountry>('Country', CountrySchema);
export const Equipment = mongoose.model<IEquipment>('Equipment', EquipmentSchema);
export const YachtCategory = mongoose.model<IYachtCategory>('YachtCategory', YachtCategorySchema);
export const Service = mongoose.model<IService>('Service', ServiceSchema);
export const YachtBuilder = mongoose.model<IYachtBuilder>('YachtBuilder', YachtBuilderSchema);
export const CharterCompany = mongoose.model<ICharterCompany>('CharterCompany', CharterCompanySchema);
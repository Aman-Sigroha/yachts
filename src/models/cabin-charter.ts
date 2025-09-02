import mongoose, { Document, Schema } from 'mongoose';

// Bank Account interface
export interface IBankAccount {
    bankName: string;
    bankAddress: string;
    accountNumber: string;
    swift?: string;
    iban?: string;
    sepa?: string;
}

// Charter Base interface
export interface ICharterBase extends Document {
    id: number;
    locationId: number;
    companyId: number;
    disabled: boolean;
    checkInTime: string;
    checkOutTime: string;
    lat: number;
    lon: number;
    updatedAt: Date;
}

// Charter Company interface
export interface ICharterCompany extends Document {
    id: number;
    name: string;
    address: string;
    city: string;
    zip: string;
    countryId: number;
    phone: string;
    fax?: string;
    mobile?: string;
    vatcode: string;
    web?: string;
    email: string;
    pac: boolean;
    bankAccounts: IBankAccount[];
    updatedAt: Date;
}

// Charter Base Schema
const CharterBaseSchema = new Schema<ICharterBase>({
    id: { type: Number, required: true, unique: true },
    locationId: { type: Number, required: true },
    companyId: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Charter Company Schema
const CharterCompanySchema = new Schema<ICharterCompany>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    countryId: { type: Number, required: true },
    phone: { type: String, required: true },
    fax: { type: String },
    mobile: { type: String },
    vatcode: { type: String, required: true },
    web: { type: String },
    email: { type: String, required: true },
    pac: { type: Boolean, default: false },
    bankAccounts: [{
        bankName: { type: String, required: true },
        bankAddress: { type: String, required: true },
        accountNumber: { type: String, required: true },
        swift: { type: String },
        iban: { type: String },
        sepa: { type: String }
    }],
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create models
export const CabinCharterBase = mongoose.model<ICharterBase>('CabinCharterBase', CharterBaseSchema);
export const CabinCharterCompany = mongoose.model<ICharterCompany>('CabinCharterCompany', CharterCompanySchema);

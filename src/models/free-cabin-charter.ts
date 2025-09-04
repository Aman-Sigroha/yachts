import mongoose, { Document, Schema } from 'mongoose';

// Free Cabin Charter Package Period
export interface IFreeCabinPackagePeriod {
  periodFrom: string;
  periodTo: string;
  freeCabins: IFreeCabin[];
}

// Free Cabin within a period
export interface IFreeCabin {
  cabinId: number;
  numberOfFreeCabins: number;
  prices: {
    currency?: string;
    price1: string;
    price2: string;
    discounts?: Array<{
      discountItemId: number;
      amount: number;
      type: 'PERCENTAGE' | 'FIXED';
    }>;
  };
}

// Free Cabin Charter Package
export interface IFreeCabinPackage extends Document {
  packageId: number;
  packageName?: string;
  packageDescription?: {
    textEN?: string;
    textIT?: string;
    textDE?: string;
    textFR?: string;
    textHR?: string;
  };
  yachtId?: number;
  yachtName?: string;
  yachtLength?: number;
  yachtLengthFeet?: number;
  yachtEquipment?: number[];
  yachtServices?: number[];
  charterCompanyId?: number;
  charterCompanyName?: string;
  locationId?: number;
  locationName?: string;
  regionId?: number;
  regionName?: string;
  countryId?: number;
  countryName?: string;
  cabinPackagePeriods: IFreeCabinPackagePeriod[];
  cabinPackageCabins?: Array<{
    cabinId: number;
    cabinName: string;
    cabinType: string;
    maxOccupancy: number;
    totalCabins: number;
  }>;
  cabinPackagePrices?: Array<{
    occupancy: number;
    price: string;
    clientPrice: string;
    totalPriceWithExtras: string;
  }>;
  status?: 'FREE' | 'UNDER_OPTION';
  ignoreOptions?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Free Cabin Charter Search Criteria
export interface IFreeCabinSearchCriteria extends Document {
  countries: number[];
  regions: number[];
  locations: number[];
  packages: number[];
  lastUpdated: Date;
}

// Free Cabin Charter Search Request
export interface IFreeCabinSearchRequest {
  periodFrom: string;
  periodTo: string;
  locations?: number[];
  countries?: number[];
  regions?: number[];
  packages?: number[];
  ignoreOptions?: boolean;
}

// Mongoose Schemas
const FreeCabinSchema = new Schema({
  cabinId: { type: Number, required: true },
  numberOfFreeCabins: { type: Number, required: true },
  prices: {
    currency: { type: String, default: 'EUR' },
    price1: { type: String, required: true },
    price2: { type: String, required: true },
    discounts: [{
      discountItemId: { type: Number },
      amount: { type: Number },
      type: { type: String, enum: ['PERCENTAGE', 'FIXED'] }
    }]
  }
}, { _id: false });

const FreeCabinPackagePeriodSchema = new Schema({
  periodFrom: { type: String, required: true },
  periodTo: { type: String, required: true },
  freeCabins: [FreeCabinSchema]
}, { _id: false });

const FreeCabinPackageSchema = new Schema({
  packageId: { type: Number, required: true, unique: true },
  packageName: { type: String },
  packageDescription: {
    textEN: { type: String },
    textIT: { type: String },
    textDE: { type: String },
    textFR: { type: String },
    textHR: { type: String }
  },
  yachtId: { type: Number },
  yachtName: { type: String },
  yachtLength: { type: Number },
  yachtLengthFeet: { type: Number },
  yachtEquipment: [{ type: Number }],
  yachtServices: [{ type: Number }],
  charterCompanyId: { type: Number },
  charterCompanyName: { type: String },
  locationId: { type: Number },
  locationName: { type: String },
  regionId: { type: Number },
  regionName: { type: String },
  countryId: { type: Number },
  countryName: { type: String },
  cabinPackagePeriods: [FreeCabinPackagePeriodSchema],
  cabinPackageCabins: [{
    cabinId: { type: Number, required: true },
    cabinName: { type: String },
    cabinType: { type: String },
    maxOccupancy: { type: Number },
    totalCabins: { type: Number }
  }],
  cabinPackagePrices: [{
    occupancy: { type: Number, required: true },
    price: { type: String, required: true },
    clientPrice: { type: String },
    totalPriceWithExtras: { type: String }
  }],
  status: { type: String, enum: ['FREE', 'UNDER_OPTION'], default: 'FREE' },
  ignoreOptions: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'freecabinpackages'
});

const FreeCabinSearchCriteriaSchema = new Schema({
  countries: [{ type: Number }],
  regions: [{ type: Number }],
  locations: [{ type: Number }],
  packages: [{ type: Number }],
  lastUpdated: { type: Date, default: Date.now }
}, {
  collection: 'freecabincriteria'
});

// Indexes
FreeCabinPackageSchema.index({ packageId: 1 });
FreeCabinPackageSchema.index({ yachtId: 1 });
FreeCabinPackageSchema.index({ charterCompanyId: 1 });
FreeCabinPackageSchema.index({ locationId: 1 });
FreeCabinPackageSchema.index({ regionId: 1 });
FreeCabinPackageSchema.index({ countryId: 1 });
FreeCabinPackageSchema.index({ 'cabinPackagePeriods.periodFrom': 1, 'cabinPackagePeriods.periodTo': 1 });
FreeCabinPackageSchema.index({ status: 1 });

// Models
export const FreeCabinPackage = mongoose.model<IFreeCabinPackage>('FreeCabinPackage', FreeCabinPackageSchema);
export const FreeCabinSearchCriteria = mongoose.model<IFreeCabinSearchCriteria>('FreeCabinSearchCriteria', FreeCabinSearchCriteriaSchema);

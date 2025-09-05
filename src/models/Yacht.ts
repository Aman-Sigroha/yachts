import mongoose, { Schema, Document } from 'mongoose';
import { IMultilingualText, MultilingualTextSchema } from './common';
import { ICrewMember } from './crew-member';

// Yacht Equipment Interface
export interface IYachtEquipment {
    id: number;
    name: IMultilingualText;
    category: string;
    quantity?: number;
    price?: number;
    currency?: string;
    isStandard: boolean;
    isOptional: boolean;
}

// Yacht Service Interface
export interface IYachtService {
    id: number;
    name: IMultilingualText;
    description?: IMultilingualText;
    price: number;
    currency: string;
    priceMeasure: string; // per booking, per week, per day, etc.
    isObligatory: boolean;
    isOptional: boolean;
}

// Yacht Pricing Interface
export interface IYachtPricing {
    period: string;
    startDate: string;
    endDate: string;
    weeklyPrice: number;
    currency: string;
    discount?: number;
    discountType?: string; // percentage, fixed
}

// Yacht Ratings Interface
export interface IYachtRatings {
    cleanliness?: number;
    equipment?: number;
    personalService?: number;
    pricePerformance?: number;
    recommendation?: number;
    totalRating?: number;
    reviewCount?: number;
    lastUpdated?: Date;
}

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
    berthsTotal?: number;
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
    maxDiscountFromCommission?: number;
    // Additional fields for API response
    obligatoryExtras?: IYachtService[];
    totalPeople?: number;
    details?: IMultilingualText;
    images?: string[];
    pricing?: IYachtPricing[];
    agencyDiscountType?: string;
    isPremium?: boolean;
    onSale?: boolean;
    registrationNumber?: string;
    registrationCertified?: boolean;
    outOfFleetDate?: Date;
    showers?: number;
    showersCrew?: number;
    recommendedPersons?: number;
    fuelConsumption?: number;
    maxSpeed?: number;
    cruisingSpeed?: number;
    
    // Additional fields from Nausys API
    maxPersons?: number;
    buildYear?: number;
    renewed?: number;
    launchedYear?: number;
    fuelTank?: number;
    waterTank?: number;
    mastLength?: number;
    commission?: number;
    depositCurrency?: string;
    maxDiscount?: number;
    needsOptionApproval?: boolean;
    
    // Critical missing fields from Nausys API
    locationId?: number;
    cabinsCrew?: number;
    wcCrew?: number;
    engines?: number;
    engineRenewedYear?: number;
    numberOfRudderBlades?: number;
    crewedCharterType?: string;
    hullColor?: string;
    thirdPartyInsuranceAmount?: number;
    thirdPartyInsuranceCurrency?: string;
    crewMemberIds?: number[];
    crewMembers?: ICrewMember[];
    highlightsIntText?: IMultilingualText;
    noteIntText?: IMultilingualText;
    flagsid?: number[];
    seasonSpecificData?: any[];
    euminia?: any;
    
    // Sailing-specific fields
    sailTypeId?: number;
    sailRenewed?: number;
    genoaTypeId?: number;
    genoaRenewed?: number;
    steeringTypeId?: number;
    rudderBlades?: number;
    mainSailType?: string;
    genoaType?: string;
    steeringType?: string;
    
    // Additional berth specifications
    berthsCabin?: number;
    berthsSalon?: number;
    berthsCrew?: number;
    
    // Charter and propulsion details
    charterType?: string;
    propulsionType?: string;
    fourStarCharter?: boolean;
    
    // Model specifications (merged from yacht model)
    modelLoa?: number;
    modelBeam?: number;
    modelDraft?: number;
    modelDisplacement?: number;
    modelVirtualLength?: number;
    
    // Equipment and services
    standardEquipment?: IYachtEquipment[];
    optionalEquipment?: IYachtEquipment[];
    services?: IYachtService[];
    
    // Pricing information
    seasonalPricing?: IYachtPricing[];
    salePrice?: number;
    saleLocation?: string;
    
    // Ratings and reviews
    ratings?: IYachtRatings;
    mySeaCode?: string;
    
    // Additional technical specifications
    displacement?: number;
    virtualLength?: number;
    holdingTankCapacity?: number;
    batteryCapacity?: number;
    solarPanels?: boolean;
    generator?: boolean;
    
    // Navigation equipment
    gps?: boolean;
    autopilot?: boolean;
    radar?: boolean;
    depthSounder?: boolean;
    windInstrument?: boolean;
    chartplotter?: boolean;
    
    // Safety equipment
    lifeRaft?: boolean;
    lifeRaftCapacity?: number;
    epirb?: boolean;
    fireExtinguishers?: number;
    lifeJackets?: number;
    firstAidKit?: boolean;
    
    // Entertainment systems
    radio?: boolean;
    cdPlayer?: boolean;
    speakers?: boolean;
    wifi?: boolean;
    tv?: boolean;
    dvd?: boolean;
    
    // Galley equipment
    refrigerator?: boolean;
    freezer?: boolean;
    oven?: boolean;
    stove?: boolean;
    microwave?: boolean;
    coffeeMachine?: boolean;
    iceMaker?: boolean;
    
    // Deck equipment
    anchorWindlass?: string; // manual/electric
    dinghy?: boolean;
    dinghyCapacity?: number;
    outboardEngine?: boolean;
    biminiTop?: boolean;
    sprayhood?: boolean;
    deckShower?: boolean;
    cockpitTable?: boolean;
    gangway?: boolean;
    
    // Interior features
    airConditioning?: boolean;
    heating?: boolean;
    hotWater?: boolean;
    electricToilet?: boolean;
    manualToilet?: boolean;
    holdingTank?: boolean;
    salonTable?: boolean;
    convertibleSalon?: boolean;
    
    // Virtual fields (populated)
    base?: any;
    builder?: any;
    charterCompany?: any;
    yachtModel?: any;
    
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
    berthsTotal: Number,
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
    maxDiscountFromCommission: Number,
    // Additional fields for API response
    obligatoryExtras: [{
        id: Number,
        name: MultilingualTextSchema,
        description: MultilingualTextSchema,
        price: Number,
        currency: String,
        priceMeasure: String,
        isObligatory: Boolean,
        isOptional: Boolean
    }],
    totalPeople: Number,
    details: MultilingualTextSchema,
    images: [String],
    pricing: [{
        period: String,
        startDate: String,
        endDate: String,
        weeklyPrice: Number,
        currency: String,
        discount: Number,
        discountType: String
    }],
    agencyDiscountType: String,
    isPremium: Boolean,
    onSale: Boolean,
    registrationNumber: String,
    registrationCertified: Boolean,
    outOfFleetDate: Date,
    showers: Number,
    showersCrew: Number,
    recommendedPersons: Number,
    fuelConsumption: Number,
    maxSpeed: Number,
    cruisingSpeed: Number,
    
    // Additional fields from Nausys API
    maxPersons: Number,
    buildYear: Number,
    renewed: Number,
    launchedYear: Number,
    fuelTank: Number,
    waterTank: Number,
    mastLength: Number,
    commission: Number,
    depositCurrency: String,
    maxDiscount: Number,
    needsOptionApproval: Boolean,
    
    // Critical missing fields from Nausys API
    locationId: Number,
    cabinsCrew: Number,
    wcCrew: Number,
    engines: Number,
    engineRenewedYear: Number,
    numberOfRudderBlades: Number,
    crewedCharterType: String,
    hullColor: String,
    thirdPartyInsuranceAmount: Number,
    thirdPartyInsuranceCurrency: String,
    crewMemberIds: [Number],
    crewMembers: [{ type: Schema.Types.ObjectId, ref: 'CrewMember' }],
    highlightsIntText: MultilingualTextSchema,
    noteIntText: MultilingualTextSchema,
    flagsid: [Number],
    seasonSpecificData: [Schema.Types.Mixed],
    euminia: Schema.Types.Mixed,
    
    // Sailing-specific fields
    sailTypeId: Number,
    sailRenewed: Number,
    genoaTypeId: Number,
    genoaRenewed: Number,
    steeringTypeId: Number,
    rudderBlades: Number,
    mainSailType: String,
    genoaType: String,
    steeringType: String,
    
    // Additional berth specifications
    berthsCabin: Number,
    berthsSalon: Number,
    berthsCrew: Number,
    
    // Charter and propulsion details
    charterType: String,
    propulsionType: String,
    fourStarCharter: Boolean,
    
    // Model specifications (merged from yacht model)
    modelLoa: Number,
    modelBeam: Number,
    modelDraft: Number,
    modelDisplacement: Number,
    modelVirtualLength: Number,
    
    // Equipment and services
    standardEquipment: [{
        id: Number,
        name: MultilingualTextSchema,
        category: String,
        quantity: Number,
        price: Number,
        currency: String,
        isStandard: Boolean,
        isOptional: Boolean
    }],
    optionalEquipment: [{
        id: Number,
        name: MultilingualTextSchema,
        category: String,
        quantity: Number,
        price: Number,
        currency: String,
        isStandard: Boolean,
        isOptional: Boolean
    }],
    services: [{
        id: Number,
        name: MultilingualTextSchema,
        description: MultilingualTextSchema,
        price: Number,
        currency: String,
        priceMeasure: String,
        isObligatory: Boolean,
        isOptional: Boolean
    }],
    
    // Pricing information
    seasonalPricing: [{
        period: String,
        startDate: String,
        endDate: String,
        weeklyPrice: Number,
        currency: String,
        discount: Number,
        discountType: String
    }],
    salePrice: Number,
    saleLocation: String,
    
    // Ratings and reviews
    ratings: {
        cleanliness: Number,
        equipment: Number,
        personalService: Number,
        pricePerformance: Number,
        recommendation: Number,
        totalRating: Number,
        reviewCount: Number,
        lastUpdated: Date
    },
    mySeaCode: String,
    
    // Additional technical specifications
    displacement: Number,
    virtualLength: Number,
    holdingTankCapacity: Number,
    batteryCapacity: Number,
    solarPanels: Boolean,
    generator: Boolean,
    airConditioning: Boolean,
    heating: Boolean,
    
    // Navigation equipment
    gps: Boolean,
    autopilot: Boolean,
    radar: Boolean,
    depthSounder: Boolean,
    windInstrument: Boolean,
    chartplotter: Boolean,
    
    // Safety equipment
    lifeRaft: Boolean,
    lifeRaftCapacity: Number,
    epirb: Boolean,
    fireExtinguishers: Number,
    lifeJackets: Number,
    firstAidKit: Boolean,
    
    // Entertainment systems
    radio: Boolean,
    cdPlayer: Boolean,
    speakers: Boolean,
    wifi: Boolean,
    tv: Boolean,
    dvd: Boolean,
    
    // Galley equipment
    refrigerator: Boolean,
    freezer: Boolean,
    oven: Boolean,
    stove: Boolean,
    microwave: Boolean,
    coffeeMachine: Boolean,
    iceMaker: Boolean,
    
    // Deck equipment
    anchorWindlass: String,
    dinghy: Boolean,
    dinghyCapacity: Number,
    outboardEngine: Boolean,
    biminiTop: Boolean,
    sprayhood: Boolean,
    deckShower: Boolean,
    cockpitTable: Boolean,
    gangway: Boolean,
    
    // Interior features
    hotWater: Boolean,
    electricToilet: Boolean,
    manualToilet: Boolean,
    holdingTank: Boolean,
    salonTable: Boolean,
    convertibleSalon: Boolean,
    
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for base details
YachtSchema.virtual('base', {
    ref: 'Base',
    localField: 'baseId',
    foreignField: 'id',
    justOne: true
});

// Virtual populate for builder details
YachtSchema.virtual('builder', {
    ref: 'YachtBuilder',
    localField: 'builderId',
    foreignField: 'id',
    justOne: true
});

// Virtual populate for charter company details
YachtSchema.virtual('charterCompany', {
    ref: 'CharterCompany',
    localField: 'charterCompanyId',
    foreignField: 'id',
    justOne: true
});

// Virtual populate for yacht model details
YachtSchema.virtual('yachtModel', {
    ref: 'YachtModel',
    localField: 'modelId',
    foreignField: 'id',
    justOne: true
});

// Indexes
YachtSchema.index({ charterCompanyId: 1 });
YachtSchema.index({ modelId: 1 });
YachtSchema.index({ categoryId: 1 });
YachtSchema.index({ baseId: 1 });
YachtSchema.index({ length: 1 });
YachtSchema.index({ cabins: 1 });
YachtSchema.index({ berths: 1 });
YachtSchema.index({ year: 1 });
YachtSchema.index({ onSale: 1 });
YachtSchema.index({ isPremium: 1 });
YachtSchema.index({ charterType: 1 });
YachtSchema.index({ propulsionType: 1 });
YachtSchema.index({ sailTypeId: 1 });
YachtSchema.index({ steeringTypeId: 1 });
YachtSchema.index({ mySeaCode: 1 });
YachtSchema.index({ 'ratings.totalRating': 1 });

// YachtModel Schema
export interface IYachtModel extends Document {
    id: number;
    name: IMultilingualText;
    yachtCategoryId?: number;
    yachtBuilderId?: number;
    loa?: number;           // Length Overall
    beam?: number;          // Yacht beam/width
    draft?: number;         // Draft
    cabins?: number;        // Number of cabins
    wc?: number;            // Number of toilets
    waterTank?: number;     // Water tank capacity
    fuelTank?: number;      // Fuel tank capacity
    displacement?: number;  // Yacht displacement
    virtualLength?: number; // Virtual length
    builderId: number;
    updatedAt: Date;
}

const YachtModelSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: MultilingualTextSchema, required: true },
    yachtCategoryId: Number,
    yachtBuilderId: Number,
    loa: Number,           // Length Overall
    beam: Number,          // Yacht beam/width
    draft: Number,         // Draft
    cabins: Number,        // Number of cabins
    wc: Number,            // Number of toilets
    waterTank: Number,     // Water tank capacity
    fuelTank: Number,      // Fuel tank capacity
    displacement: Number,  // Yacht displacement
    virtualLength: Number, // Virtual length
    builderId: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
YachtModelSchema.index({ builderId: 1 });
YachtModelSchema.index({ virtualLength: 1 });

export const Yacht = mongoose.model<IYacht>('Yacht', YachtSchema);
export const YachtModel = mongoose.model<IYachtModel>('YachtModel', YachtModelSchema);
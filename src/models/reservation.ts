import mongoose, { Schema, Document } from 'mongoose';
import { parseDate } from '../utils/date';

// Discount Schema
const DiscountSchema = new Schema({
    discountItemId: { type: Number, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true }
}, { _id: false });

// Service Schema
const ServiceSchema = new Schema({
    id: { type: Number, required: true },
    serviceId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    listPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    calculationType: { type: String, required: true },
    condition: Schema.Types.Mixed
}, { _id: false });

// Equipment Schema
const EquipmentSchema = new Schema({
    id: { type: Number, required: true },
    equipmentId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    listPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    calculationType: { type: String, required: true },
    condition: Schema.Types.Mixed
}, { _id: false });

// Payment Plan Schema
const PaymentPlanSchema = new Schema({
    id: { type: Number, required: true },
    date: { 
        type: Date,
        set: (v: string) => parseDate(v)
    },
    amount: { type: Number, required: true },
    amountInPaymentCurrency: { type: Number, required: true },
    paid: { type: Boolean, required: true }
}, { _id: false });

// Payment Schema
const PaymentSchema = new Schema({
    id: { type: Number, required: true },
    date: { 
        type: Date,
        set: (v: string) => parseDate(v)
    },
    amount: { type: Number, required: true },
    amountInPaymentCurrency: { type: Number, required: true },
    paymentCurrency: { type: String, required: true }
}, { _id: false });

// Client Schema
const ClientSchema = new Schema({
    name: { type: String, required: true },
    surname: String,
    company: Boolean,
    countryId: Number,
    address: String,
    city: String,
    zip: String,
    email: String,
    phone: String,
    vatNr: String
}, { _id: false });

// Comment Schema
const CommentSchema = new Schema({
    id: { type: Number, required: true },
    note: { type: String, required: true },
    madeById: { type: Number, required: true },
    madeTime: { 
        type: Date,
        set: (v: string) => parseDate(v)
    },
    internalNote: { type: Boolean, default: false },
    showInBase: { type: Boolean, default: false }
}, { _id: false });

// Reservation Schema
export interface IReservation extends Document {
    id: number;
    uuid: string;
    yachtId: number;
    periodFrom: Date;
    periodTo: Date;
    baseFromId: number;
    baseToId: number;
    locationFromId: number;
    locationToId: number;
    client: {
        name: string;
        surname?: string;
        company?: boolean;
        countryId?: number;
        address?: string;
        city?: string;
        zip?: string;
        email?: string;
        phone?: string;
        vatNr?: string;
    };
    reservationType: string;
    bookingType: string;
    currency: string;
    priceListPrice: number;
    agencyPrice: number;
    clientPrice: number;
    paymentCurrency: string;
    securityDeposit: number;
    approved: boolean;
    createdDate: Date;
    lastModifiedAt: Date;
    discounts: Array<{
        discountItemId: number;
        amount: number;
        type: string;
    }>;
    services: Array<{
        id: number;
        serviceId: number;
        quantity: number;
        listPrice: number;
        amount: number;
        currency: string;
        calculationType: string;
        condition?: any;
    }>;
    additionalEquipment: Array<{
        id: number;
        equipmentId: number;
        quantity: number;
        listPrice: number;
        amount: number;
        currency: string;
        calculationType: string;
        condition?: any;
    }>;
    paymentPlans: Array<{
        id: number;
        date: Date;
        amount: number;
        amountInPaymentCurrency: number;
        paid: boolean;
    }>;
    payments: Array<{
        id: number;
        date: Date;
        amount: number;
        amountInPaymentCurrency: number;
        paymentCurrency: string;
    }>;
    comments: Array<{
        id: number;
        note: string;
        madeById: number;
        madeTime: Date;
        internalNote: boolean;
        showInBase: boolean;
    }>;
    updatedAt: Date;
}

const ReservationSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    uuid: { type: String, required: true },
    yachtId: { type: Number, required: true },
    periodFrom: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    periodTo: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    baseFromId: { type: Number, required: true },
    baseToId: { type: Number, required: true },
    locationFromId: { type: Number, required: true },
    locationToId: { type: Number, required: true },
    client: { type: ClientSchema, required: true },
    reservationType: { type: String, required: true },
    bookingType: { type: String, required: true },
    currency: { type: String, required: true },
    priceListPrice: { type: Number, required: true },
    agencyPrice: { type: Number, required: true },
    clientPrice: { type: Number, required: true },
    paymentCurrency: { type: String, required: true },
    securityDeposit: { type: Number, required: true },
    approved: { type: Boolean, required: true },
    createdDate: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    lastModifiedAt: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    discounts: [DiscountSchema],
    services: [ServiceSchema],
    additionalEquipment: [EquipmentSchema],
    paymentPlans: [PaymentPlanSchema],
    payments: [PaymentSchema],
    comments: [CommentSchema],
    updatedAt: { type: Date, default: Date.now }
});

// Occupancy Schema
export interface IOccupancy extends Document {
    companyId: number;
    yachtId: number;
    periodFrom: Date;
    periodTo: Date;
    checkInTime: string;
    checkOutTime: string;
    locationFromId: number;
    locationToId: number;
    reservationType: string;
    updatedAt: Date;
}

const OccupancySchema = new Schema({
    companyId: { type: Number, required: true },
    yachtId: { type: Number, required: true },
    periodFrom: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    periodTo: { 
        type: Date, 
        required: true,
        set: (v: string) => parseDate(v)
    },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },
    locationFromId: { type: Number, required: true },
    locationToId: { type: Number, required: true },
    reservationType: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
export const Occupancy = mongoose.model<IOccupancy>('Occupancy', OccupancySchema);
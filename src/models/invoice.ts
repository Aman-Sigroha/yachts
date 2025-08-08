import mongoose, { Schema, Document } from 'mongoose';

// Invoice Schema
export interface IInvoice extends Document {
    id: number;
    number: string;
    date: Date;
    dueDate: Date;
    currency: string;
    totalAmount: number;
    totalAmountWithVat: number;
    totalVatAmount: number;
    reservationId: number;
    invoiceType: 'base' | 'agency' | 'owner';  // Added to track invoice source
    client: {
        name: string;
        address?: string;
        city?: string;
        zip?: string;
        country?: string;
        vatNr?: string;
    };
    items: Array<{
        id: number;
        description: string;
        quantity: number;
        price: number;
        amount: number;
        vatPercentage: number;
        vatAmount: number;
        amountWithVat: number;
        discounts?: Array<{
            amount: number;
            type: string;
            description?: string;
        }>;
    }>;
    vatItems: Array<{
        percentage: number;
        baseAmount: number;
        vatAmount: number;
    }>;
    updatedAt: Date;
}

const InvoiceSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    number: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    currency: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totalAmountWithVat: { type: Number, required: true },
    totalVatAmount: { type: Number, required: true },
    reservationId: { type: Number, required: true },
    invoiceType: { type: String, required: true, enum: ['base', 'agency', 'owner'] },
    client: {
        name: { type: String, required: true },
        address: String,
        city: String,
        zip: String,
        country: String,
        vatNr: String
    },
    items: [{
        id: { type: Number, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true },
        vatPercentage: { type: Number, required: true },
        vatAmount: { type: Number, required: true },
        amountWithVat: { type: Number, required: true },
        discounts: [{
            amount: Number,
            type: String,
            description: String
        }]
    }],
    vatItems: [{
        percentage: { type: Number, required: true },
        baseAmount: { type: Number, required: true },
        vatAmount: { type: Number, required: true }
    }],
    updatedAt: { type: Date, default: Date.now }
});

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);

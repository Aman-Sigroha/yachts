import mongoose, { Schema, Document } from 'mongoose';

// CrewList Schema
export interface ICrewMember extends Document {
    id: number;
    reservationId: number;
    name: string;
    surname: string;
    dateOfBirth?: Date;
    placeOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    passportIssuedAt?: Date;
    passportValidTo?: Date;
    passportIssuedIn?: string;
    address?: string;
    postcode?: string;
    city?: string;
    country?: string;
    role?: string;
    skipper?: boolean;
    disabledPerson?: boolean;
    shoeSize?: string;
    embarkmentDate?: Date;
    disembarkmentDate?: Date;
    updatedAt: Date;
}

const CrewMemberSchema = new Schema({
    id: { type: Number, required: true },
    reservationId: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dateOfBirth: Date,
    placeOfBirth: String,
    nationality: String,
    passportNumber: String,
    passportIssuedAt: Date,
    passportValidTo: Date,
    passportIssuedIn: String,
    address: String,
    postcode: String,
    city: String,
    country: String,
    role: String,
    skipper: Boolean,
    disabledPerson: Boolean,
    shoeSize: String,
    embarkmentDate: Date,
    disembarkmentDate: Date,
    updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for reservationId and id
CrewMemberSchema.index({ reservationId: 1, id: 1 }, { unique: true });

export const CrewMember = mongoose.model<ICrewMember>('CrewMember', CrewMemberSchema);

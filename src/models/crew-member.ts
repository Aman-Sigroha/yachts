import mongoose, { Document, Schema } from 'mongoose';

export interface ICrewMember extends Document {
    id: number;
    name: string;
    surname: string;
    crewRole: string;
    livingPlace: string;
    summary: string;
    photoUrl: string;
    languages: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CrewMemberSchema = new Schema<ICrewMember>({
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    crewRole: { type: String, required: true },
    livingPlace: { type: String, default: '' },
    summary: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    languages: [{ type: String }]
}, {
    timestamps: true
});

// Index for efficient queries
CrewMemberSchema.index({ id: 1 });
CrewMemberSchema.index({ crewRole: 1 });

export const CrewMember = mongoose.model<ICrewMember>('CrewMember', CrewMemberSchema);

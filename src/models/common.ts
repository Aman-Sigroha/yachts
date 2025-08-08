import { Schema } from 'mongoose';

// Common interface for multilingual text
export interface IMultilingualText {
    textCZ?: string;
    textDE?: string;
    textEN: string;  // English is required
    textES?: string;
    textFR?: string;
    textHR?: string;
    textHU?: string;
    textIT?: string;
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
}

// Schema for multilingual text
export const MultilingualTextSchema = new Schema({
    textCZ: String,
    textDE: String,
    textEN: { type: String, required: true },
    textES: String,
    textFR: String,
    textHR: String,
    textHU: String,
    textIT: String,
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
}, { _id: false });

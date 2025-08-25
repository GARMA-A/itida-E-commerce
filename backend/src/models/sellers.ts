import mongoose, { Schema, Document } from 'mongoose';

export interface ISeller extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'suspended';
  verified: boolean; 
  commissionRate: number;
  documents: string[];
  createdAt: Date;
}

const SellerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  verified: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 0 },
  documents: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISeller>('Seller', SellerSchema);

import mongoose, { Schema, Document } from 'mongoose';
import Seller from './sellers.ts';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  seller: Seller['_id'];
  category: string;          
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;         
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  category: { type: String, default: 'Uncategorized' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
ProductSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);

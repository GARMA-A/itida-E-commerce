import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './product.ts';

export interface IOrder extends Document {
  products: { product: IProduct['_id']; quantity: number }[];
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);

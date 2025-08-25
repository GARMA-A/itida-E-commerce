import mongoose, { Schema, Document } from 'mongoose';
import { ISeller } from './sellers.ts';
import { IOrder } from './orders.ts';

export interface IReport extends Document {
  seller: ISeller['_id'];
  orders: IOrder['_id'][];
  totalSales: number;
  generatedAt: Date;
}

const ReportSchema: Schema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  totalSales: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>('Report', ReportSchema);

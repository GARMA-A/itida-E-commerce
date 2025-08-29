import { User } from './user';
import { CartItem } from './cart-item';

export interface Order {
  _id?: string;
  userId: string;
  user?: User;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
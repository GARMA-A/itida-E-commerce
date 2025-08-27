export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

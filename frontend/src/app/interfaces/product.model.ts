export interface Product {
  id: number;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  description: string;
  category: string;
  stock: number;
}

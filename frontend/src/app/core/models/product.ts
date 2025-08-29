export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  brand?: string;
  featured?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}

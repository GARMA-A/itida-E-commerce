export interface Product {
  id: number | string; // Can be either number or string (for MongoDB _id)
  title: string;
  description: string;
  price: number;
  discountPrice?: number; // Optional since API doesn't have it
  image: string; // Will use first image from images array or fallback
  images?: string[]; // Optional array of images from API
  rating: number; // Default value since API doesn't have it
  reviews: number; // Default value since API doesn't have it
  category: string;
  stock: number;
  featured?: boolean; // From API
  active?: boolean; // From API
  createdAt?: string; // From API
  updatedAt?: string; // From API
}

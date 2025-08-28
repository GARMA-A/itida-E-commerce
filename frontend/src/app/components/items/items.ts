import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.model';
import { CartItem } from '../../interfaces/cart-item.model';
import { CommonModule } from '@angular/common';
import { ProductModal } from "../product-modal/product-modal";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrls: ['./items.scss'],
  imports: [CommonModule,FormsModule, ProductModal]
})
export class ItemsComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'all';
  products: Product[] = [
    {
      id: 1,
      title: 'Play Station 5 hand',
      price: 22.5,
      discountPrice: 35,
      image: 'https://cdn.salla.sa/lvble/334ffc52-bbe0-4ac0-98f0-ed0a9a0a4608-1000x562.18487394958-5fMTDSUtwnOXtxA5j8L0NTL4zU0KLlGpi2A73oxk.jpg',
      rating: 5,
      reviews: 88,
      description: 'High-quality gaming controller',
      category: 'gaming',
      stock: 20
    },
    {
      id: 2,
      title: 'Dynamic Gaming keyboard',
      price: 123.25,
      image: 'https://m.media-amazon.com/images/I/71llupxqkYL._UF1000,1000_QL80_.jpg',
      rating: 4,
      reviews: 56,
      description: 'RGB mechanical gaming keyboard',
      category: 'gaming',
      stock: 15
    },
    {
    id: 3,
    title: 'Ultra HD 4K Monitor',
    price: 299.99,
    discountPrice: 350,
    image: 'data:image/jpeg;base64,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',
    rating: 5,
    reviews: 120,
    description: '27-inch Ultra HD display with HDR support',
    category: 'electronics',
    stock: 10
  },
  {
    id: 4,
    title: 'Wireless Gaming Headset',
    price: 89.99,
    image: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg',
    rating: 4,
    reviews: 78,
    description: 'Noise-cancelling over-ear wireless headset',
    category: 'gaming',
    stock: 25
  },
  {
    id: 5,
    title: 'Ergonomic Office Chair',
    price: 199.0,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQWJinA7fUAudFbEwkQcwN8r6t7fCmL1f91SINvpojU3QbyKwSmqBSeYVKXD9JApGZ8lWegdERc8kDlpymuw6_Y0dVMcONqbVc67n6ZS8k2&usqp=CAc',
    rating: 5,
    reviews: 95,
    description: 'Comfortable adjustable chair for long sessions',
    category: 'furniture',
    stock: 8
  },
  {
    id: 6,
    title: 'Smartphone Tripod Stand',
    price: 29.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/41OtpnxSmYL.jpg',
    rating: 3,
    reviews: 40,
    description: 'Lightweight tripod with adjustable height',
    category: 'accessories',
    stock: 30
  },
  {
    id: 7,
    title: 'Portable SSD 1TB',
    price: 149.99,
    discountPrice: 180,
    image: 'data:image/webp;base64,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',
    rating: 5,
    reviews: 102,
    description: 'High-speed USB-C external storage drive',
    category: 'electronics',
    stock: 12
  },
  {
    id: 8,
    title: 'Mechanical Gaming Mouse',
    price: 59.99,
    image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
    rating: 4,
    reviews: 64,
    description: 'High-precision sensor with RGB lighting',
    category: 'gaming',
    stock: 18
  }
  ];

  selectedProduct: Product | null = null;
  showModal = false;
  selectedQuantity = 1;
  showSuccessMessage = false;

  ngOnInit() {
    // Any initialization logic here
  }

  openProductModal(product: Product) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  updateQuantity(quantity: number) {
    this.selectedQuantity = quantity;
  }
  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
  filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
  }
}

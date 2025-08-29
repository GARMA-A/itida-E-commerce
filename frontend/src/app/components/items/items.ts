import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.model';
// import { CartItem } from '../../interfaces/cart-item.model';
import { CommonModule } from '@angular/common';
import { ProductModal } from "../product-modal/product-modal";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrls: ['./items.scss'],
  imports: [CommonModule, FormsModule, ProductModal]
})
export class ItemsComponent implements OnInit {


  searchTerm: string = '';
  selectedCategory: string = 'all';
  products: Product[] = [];
  isLoading: boolean = true;
  error: string = '';

  selectedProduct: Product | null = null;
  showModal = false;
  selectedQuantity = 1;
  showSuccessMessage = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = '';

    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (apiProducts) => {
        // Transform API data to match your Product interface
        this.products = apiProducts.map(apiProduct => ({
          id: apiProduct._id,
          title: apiProduct.title,
          price: apiProduct.price,
          discountPrice: undefined, // API doesn't have discount price
          image: apiProduct.images && apiProduct.images.length > 0
            ? apiProduct.images[0]
            : 'https://via.placeholder.com/300x200?text=No+Image', // Fallback image
          rating: 5, // Default rating since API doesn't have it
          reviews: 0, // Default reviews since API doesn't have it
          description: apiProduct.description,
          category: apiProduct.category,
          stock: apiProduct.stock
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;

        // Fallback to hardcoded data in case of API failure
        this.loadFallbackProducts();
      }
    });
  }

  private loadFallbackProducts() {
    // Keep your original hardcoded products as fallback
    this.products = [
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
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGC4dHx0tKy0tLS0rLS0tLS0rLS0rLSstLS0uLSsrKy0tLS4tLS0tKzUtLS0tLS0tKy0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAECBAUGB//EAE0QAAEDAgIEBg4FCgQHAAAAAAEAAgMEERIhBQYxURNBYXGS0QcUIyQyUlNzgZGhsbLBI6JygrMVMzREVGKCk8LSQkOU8BUXZNBD4fH/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQIEAwUG/8QAMhEBAAIBAgQEAwYHAQAAAAAAAAECEQMhEjEyQVFhcYGRIqGxweHwExQjJEJS0fEV/9oADAMBAAIRAxEAPwA7cFSBQgVK60MYt1FxUbpiUEgVIFCBT3QGunuhAp7oDYki8AXOxCus/WI96VHmJfw3ILh0pANs0Q55GdaG/T9INtVTjnmiH9SraN1ZoTBE7tOmuYoyTwMdySwEk5IzdXaIHKkpx/4Y/wC1Ybb..',
        rating: 5,
        reviews: 120,
        description: '27-inch Ultra HD display with HDR support',
        category: 'electronics',
        stock: 10
      },
      // Add more fallback products as needed...
    ];
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

  // Method to retry loading products
  retryLoadProducts() {
    this.loadProducts();
  }
}

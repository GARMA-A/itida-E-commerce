import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { LoadingService } from '../../core/services/loading';
import { Product } from '../../core/models/product';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-test-container">
      <h2>🚀 Backend Integration Test Dashboard</h2>
      
      <div class="status-section">
        <h3>📊 Service Status</h3>
        <div class="status-grid">
          <div class="status-card">
            <h4>🔐 Auth Service</h4>
            <p>Status: <span [class]="authService.isAuthenticated() ? 'status-success' : 'status-pending'">
              {{ authService.isAuthenticated() ? 'Authenticated' : 'Not Authenticated' }}
            </span></p>
            <p *ngIf="currentUser">Welcome, {{ currentUser.firstName }} {{ currentUser.lastName }}!</p>
          </div>
          
          <div class="status-card">
            <h4>🛒 Cart Service</h4>
            <p>Items Count: <span class="status-info">{{ cartItemsCount }}</span></p>
            <p>Total: <span class="status-info">\${{ cartTotal.toFixed(2) }}</span></p>
          </div>
          
          <div class="status-card">
            <h4>📦 Product Service</h4>
            <p>Products Loaded: <span class="status-info">{{ productsCount }}</span></p>
            <button (click)="testProductService()" [disabled]="isLoading">
              {{ isLoading ? 'Loading...' : 'Test Product API' }}
            </button>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h3>🧪 API Test Actions</h3>
        
        <div class="test-actions">
          <div class="test-group">
            <h4>Authentication Tests</h4>
            <div class="form-group">
              <input type="email" [(ngModel)]="testEmail" placeholder="Test Email" />
              <input type="password" [(ngModel)]="testPassword" placeholder="Test Password" />
              <button (click)="testLogin()" [disabled]="isLoading">Test Login</button>
            </div>
          </div>
          
          <div class="test-group">
            <h4>Product Tests</h4>
            <button (click)="testGetProducts()" [disabled]="isLoading">Get All Products</button>
            <button (click)="testSearchProducts()" [disabled]="isLoading">Search Products</button>
            <button (click)="testGetCategories()" [disabled]="isLoading">Get Categories</button>
          </div>
          
          <div class="test-group">
            <h4>Cart Tests</h4>
            <button (click)="testGetCart()" [disabled]="isLoading">Get Cart</button>
            <button (click)="testAddToCart()" [disabled]="isLoading || !testProduct">Add Test Product to Cart</button>
          </div>
        </div>
      </div>

      <div class="results-section" *ngIf="testResults.length > 0">
        <h3>📋 Test Results</h3>
        <div class="results-list">
          <div *ngFor="let result of testResults" 
               [class]="'result-item result-' + result.status">
            <strong>{{ result.action }}</strong>
            <span class="result-status">{{ result.status.toUpperCase() }}</span>
            <p>{{ result.message }}</p>
            <pre *ngIf="result.data">{{ result.data | json }}</pre>
          </div>
        </div>
      </div>

      <div class="loading-indicator" *ngIf="isLoading">
        <p>🔄 Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      color: #333;
      border-bottom: 3px solid #007bff;
      padding-bottom: 0.5rem;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .status-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
    }

    .status-card h4 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .status-success { color: #28a745; font-weight: bold; }
    .status-pending { color: #ffc107; font-weight: bold; }
    .status-info { color: #007bff; font-weight: bold; }

    .test-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 1rem 0;
    }

    .test-group {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
    }

    .test-group h4 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin: 0.25rem;
      font-size: 0.9rem;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .results-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .result-item {
      background: #f8f9fa;
      border-left: 4px solid #dee2e6;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
    }

    .result-success { border-left-color: #28a745; }
    .result-error { border-left-color: #dc3545; }

    .result-status {
      float: right;
      font-weight: bold;
    }

    pre {
      background: #f1f3f4;
      padding: 0.5rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.8rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .loading-indicator {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 1000;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  authService = inject(Auth);
  productService = inject(ProductService);
  cartService = inject(CartService);
  loadingService = inject(LoadingService);

  currentUser: User | null = null;
  cartItemsCount = 0;
  cartTotal = 0;
  productsCount = 0;
  isLoading = false;
  testProduct: Product | null = null;

  // Test form data
  testEmail = 'test@example.com';
  testPassword = 'password123';

  // Test results
  testResults: Array<{
    action: string;
    status: 'success' | 'error';
    message: string;
    data?: any;
  }> = [];

  ngOnInit() {
    // Subscribe to auth state
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Subscribe to cart state
    this.cartService.cart$.subscribe(cart => {
      this.cartTotal = cart?.totalAmount || 0;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // Subscribe to loading state
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    // Initial API connectivity test
    this.testProductService();
  }

  testLogin() {
    this.authService.login({ email: this.testEmail, password: this.testPassword }).subscribe({
      next: (response) => {
        this.addTestResult('Login Test', 'success', 'Login successful!', response);
      },
      error: (error) => {
        this.addTestResult('Login Test', 'error', error.message || 'Login failed', error);
      }
    });
  }

  testProductService() {
    this.testGetProducts();
  }

  testGetProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productsCount = response.data?.length || 0;
        if (response.data && response.data.length > 0) {
          this.testProduct = response.data[0];
        }
        this.addTestResult('Get Products', 'success', `Retrieved ${this.productsCount} products`, response);
      },
      error: (error) => {
        this.addTestResult('Get Products', 'error', error.message || 'Failed to fetch products', error);
      }
    });
  }

  testSearchProducts() {
    this.productService.searchProducts('test').subscribe({
      next: (response) => {
        this.addTestResult('Search Products', 'success', `Found ${response.data?.length || 0} products`, response);
      },
      error: (error) => {
        this.addTestResult('Search Products', 'error', error.message || 'Search failed', error);
      }
    });
  }

  testGetCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.addTestResult('Get Categories', 'success', `Retrieved ${response.length || 0} categories`, response);
      },
      error: (error) => {
        this.addTestResult('Get Categories', 'error', error.message || 'Failed to fetch categories', error);
      }
    });
  }

  testGetCart() {
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.addTestResult('Get Cart', 'success', 'Cart retrieved successfully', response);
      },
      error: (error) => {
        this.addTestResult('Get Cart', 'error', error.message || 'Failed to get cart', error);
      }
    });
  }

  testAddToCart() {
    if (!this.testProduct) {
      this.addTestResult('Add to Cart', 'error', 'No test product available');
      return;
    }

    this.cartService.addToCart(this.testProduct, 1).subscribe({
      next: (response) => {
        this.addTestResult('Add to Cart', 'success', 'Item added to cart successfully', response);
      },
      error: (error) => {
        this.addTestResult('Add to Cart', 'error', error.message || 'Failed to add to cart', error);
      }
    });
  }

  private addTestResult(action: string, status: 'success' | 'error', message: string, data?: any) {
    this.testResults.unshift({
      action,
      status,
      message,
      data: data ? (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) : undefined
    });

    // Keep only last 10 results
    if (this.testResults.length > 10) {
      this.testResults = this.testResults.slice(0, 10);
    }
  }
}
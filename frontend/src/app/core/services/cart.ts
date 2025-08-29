import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../models/cart-item';
import { Product } from '../models/product';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  /**
   * Get user's cart
   */
  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl)
      .pipe(
        tap(response => {
          if (response.data) {
            this.cartSubject.next(response.data);
            this.cartItemsSubject.next(response.data.items || []);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Add item to cart
   */
  addToCart(product: Product, quantity: number): Observable<ApiResponse<Cart>> {
    const request: AddToCartRequest = {
      productId: product._id!,
      quantity
    };

    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/add`, request)
      .pipe(
        tap(response => {
          if (response.data) {
            this.cartSubject.next(response.data);
            this.cartItemsSubject.next(response.data.items || []);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Remove item from cart
   */
  removeFromCart(productId: string): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/remove/${productId}`)
      .pipe(
        tap(response => {
          if (response.data) {
            this.cartSubject.next(response.data);
            this.cartItemsSubject.next(response.data.items || []);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Update item quantity in cart
   */
  updateQuantity(productId: string, quantity: number): Observable<ApiResponse<Cart>> {
    const request: UpdateCartItemRequest = {
      productId,
      quantity
    };

    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/update`, request)
      .pipe(
        tap(response => {
          if (response.data) {
            this.cartSubject.next(response.data);
            this.cartItemsSubject.next(response.data.items || []);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Clear entire cart
   */
  clearCart(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/clear`)
      .pipe(
        tap(() => {
          this.cartSubject.next(null);
          this.cartItemsSubject.next([]);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get cart items (from local state)
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Get cart total amount
   */
  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart?.totalAmount || 0;
  }

  /**
   * Get cart items count
   */
  getCartItemsCount(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: string): boolean {
    const items = this.cartItemsSubject.value;
    return items.some(item => item.product._id === productId);
  }

  /**
   * Get quantity of specific product in cart
   */
  getProductQuantity(productId: string): number {
    const items = this.cartItemsSubject.value;
    const item = items.find(item => item.product._id === productId);
    return item?.quantity || 0;
  }

  /**
   * Load cart on service initialization
   */
  private loadCart(): void {
    this.getCart().subscribe({
      next: () => {
        // Cart loaded successfully
      },
      error: (error) => {
        console.warn('Could not load cart:', error);
        // Initialize empty cart state
        this.cartSubject.next(null);
        this.cartItemsSubject.next([]);
      }
    });
  }

  /**
   * Private error handler
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Cart Service Error:', error);
    return throwError(() => ({
      message: error.error?.message || 'An error occurred with the shopping cart',
      status: error.status || 500,
      error: error.error
    }));
  };
}

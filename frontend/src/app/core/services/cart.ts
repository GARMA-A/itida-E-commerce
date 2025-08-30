import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../../interfaces/product.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  addToCart(product: Product, quantity: number = 1): { success: boolean, message?: string } {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      return { 
        success: false, 
        message: 'Please log in to add items to your cart' 
      };
    }

    const existingItemIndex = this.cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        id: `cart_${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.discountPrice || product.price,
        quantity: quantity,
        image: product.image,
        stock: product.stock
      };
      this.cartItems.push(cartItem);
    }
    
    this.saveCart();
    this.cartItemsSubject.next(this.cartItems);
    return { success: true };
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
    this.cartItemsSubject.next(this.cartItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.saveCart();
        this.cartItemsSubject.next(this.cartItems);
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
    this.cartItemsSubject.next(this.cartItems);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}

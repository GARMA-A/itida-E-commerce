import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      currentItems.push(item);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(itemId: number) {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter((item) => item.id !== itemId);
    this.updateCart(updatedItems);
  }

  updateQuantity(itemId: number, quantity: number) {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find((item) => item.id === itemId);

    if (item) {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;
      this.updateCart(currentItems);
    }
  }

  clearCart() {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]) {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(items.reduce((total, item) => total + item.quantity, 0));
    this.saveCart(items);
  }

  private loadCart() {
    const cartData = localStorage.getItem('popDataArray');
    if (cartData) {
      try {
        const items = JSON.parse(cartData);

        const cartItems = items.map((item: any) => ({
          id: item.id || Date.now() + Math.random(),
          title: item.title || 'Unknown Product',
          price: parseFloat(item.price || 0),
          quantity: parseInt(item.numberOfItems || item.quantity || 1),
          image: item.image || '',
          subtotal: parseFloat(
            item.subPrice || item.price * (item.numberOfItems || item.quantity || 1)
          ),
        }));
        this.cartItemsSubject.next(cartItems);
        this.cartCountSubject.next(
          cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
        );
      } catch (error) {
        console.error('Error parsing cart data:', error);
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }
    }
  }

  private saveCart(items: CartItem[]) {
    const popDataArray = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price.toString(),
      numberOfItems: item.quantity.toString(),
      subPrice: item.subtotal.toString(),
      image: item.image,
    }));

    localStorage.setItem('popDataArray', JSON.stringify(popDataArray));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item';
import { CartService } from '../../core/services/cart';
import { CartItem, CartSummary } from '../../core/models/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  };

  isLoading = true;
  isEmpty = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.isEmpty = this.cartItems.length === 0;
      this.calculateSummary();
      this.isLoading = false;
    });
  }

  increaseQuantity(itemId: number) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: number) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }

  deleteAllItems() {
    if (confirm('Are you sure you want to remove all items from your cart?')) {
      this.cartService.clearCart();
    }
  }

  confirmOrder() {
    if (this.cartItems.length === 0) return;

    const orderData = {
      items: this.cartItems,
      summary: this.cartSummary,
      orderDate: new Date().toISOString(),
      orderId: 'ORD-' + Date.now(),
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    this.cartService.clearCart();
    this.router.navigate(['/success']);
  }

  continueShopping() {
    this.router.navigate(['/items']);
  }

  private calculateSummary() {
    this.cartSummary.itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartSummary.subtotal = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
    this.cartSummary.tax = this.cartSummary.subtotal * 0.1;
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.tax;
  }
}

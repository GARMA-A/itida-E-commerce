import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem as CartItemModel } from '../../core/models/cart-item';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {
  @Input() cartItem!: CartItemModel;
  @Output() updateQuantity = new EventEmitter<{ productId: number, quantity: number }>();
  @Output() removeItem = new EventEmitter<number>();

  onQuantityChange(quantity: number) {
    if (quantity > 0 && quantity <= this.cartItem.stock) {
      this.updateQuantity.emit({ productId: this.cartItem.productId, quantity });
    }
  }

  onRemove() {
    this.removeItem.emit(this.cartItem.productId);
  }

  increaseQuantity() {
    if (this.cartItem.quantity < this.cartItem.stock) {
      this.onQuantityChange(this.cartItem.quantity + 1);
    }
  }

  decreaseQuantity() {
    if (this.cartItem.quantity > 1) {
      this.onQuantityChange(this.cartItem.quantity - 1);
    }
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../core/models/cart-item';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityIncrease = new EventEmitter<number>();
  @Output() quantityDecrease = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  increaseQuantity() {
    this.quantityIncrease.emit(this.item.id);
  }

  decreaseQuantity() {
    this.quantityDecrease.emit(this.item.id);
  }

  removeItem() {
    this.remove.emit(this.item.id);
  }
}

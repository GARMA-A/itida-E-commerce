import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemsComponent } from "../items/items";
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.model';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../core/services/cart';

@Component({
  selector: 'app-product-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss'
})
export class ProductModal {
  @Input() product!: Product;
  @Input() quantity = 1;
  @Input() close!: () => void;
  @Output() addToCartEvent = new EventEmitter<{ product: Product, quantity: number }>();

  addToCart() {
    if (!this.product) return;
    this.addToCartEvent.emit({ product: this.product, quantity: this.quantity });
    const successMsg = document.querySelector(".correct") as HTMLElement;
    if (successMsg) {
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 2000);
    }
  }
}

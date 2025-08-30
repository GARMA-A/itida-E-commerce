import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemsComponent } from "../items/items";
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.model';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../core/services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss'
})
export class ProductModal {
  @Input() product!: Product;
  @Input() quantity = 1;
  @Input() close!: () => void;
  @Output() addToCartEvent = new EventEmitter<{ product: Product, quantity: number }>();

  constructor(
    private cartService: Cart,
    private router: Router
  ) { }

  addToCart() {
    if (!this.product) return;

    // Try to add to cart service
    const result = this.cartService.addToCart(this.product, this.quantity);

    if (!result.success) {
      // Show login required message and redirect to login
      alert(result.message);
      this.router.navigate(['/auth/login']);
      this.close();
      return;
    }

    // Emit event for parent component
    this.addToCartEvent.emit({ product: this.product, quantity: this.quantity });

    // Show success message
    const successMsg = document.querySelector(".correct") as HTMLElement;
    if (successMsg) {
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 2000);
    }
  }
}

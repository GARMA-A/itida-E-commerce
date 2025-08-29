import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  cartItemCount = 0;

  constructor(private cartService: Cart) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }
}

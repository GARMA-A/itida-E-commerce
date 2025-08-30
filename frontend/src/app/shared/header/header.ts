import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/services/cart';
import { AuthService, User } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  cartItemCount = 0;
  currentUser: User | null = null;
  isLoggedIn = false;

  constructor(
    private cartService: Cart,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout();
  }
}

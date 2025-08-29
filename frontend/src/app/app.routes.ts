import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Cart } from './pages/cart/cart';
import { Products } from './pages/products/products';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { UserManagement } from './auth/user-management/user-management';
import { Success } from './pages/success/success';
import { ErrorPage } from './pages/error-page/error-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'products', component: Products },
  { path: 'cart', component: Cart },
  { path: 'auth/login', component: Login },
  { path: 'auth/seller-login', component: Login, data: { type: 'seller' } },
  { path: 'auth/signup', component: Signup },
  { path: 'auth/manage', component: UserManagement },
  { path: 'success', component: Success },
  { path: 'error', component: ErrorPage },
  { path: '**', component: ErrorPage }
];

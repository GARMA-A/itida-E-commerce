import { Component, signal } from '@angular/core';
import { ProductModal } from "./components/product-modal/product-modal";
import { ItemsComponent } from "./components/items/items";
import { Home } from "./pages/home/home";
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Footer } from "./shared/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('E-commerce');
}

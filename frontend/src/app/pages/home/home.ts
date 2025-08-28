import { Component } from '@angular/core';
import { ItemsComponent } from "../../components/items/items";
import { Header } from "../../shared/header/header";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ItemsComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {


}

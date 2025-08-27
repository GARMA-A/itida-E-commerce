import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactFormComponent } from './components/contact-form/contact-form';
import { About } from './pages/about/about';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet , ContactFormComponent , About],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('E-commerce');
}

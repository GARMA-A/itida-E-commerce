import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactFormComponent } from './components/contact-form/contact-form';
<<<<<<< HEAD
import { About } from './pages/about/about';
=======
>>>>>>> 80b4921589b3d15ff3ea9dc72a3f8607b86d8489


@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet , ContactFormComponent , About],
=======
  imports: [RouterOutlet , ContactFormComponent],
>>>>>>> 80b4921589b3d15ff3ea9dc72a3f8607b86d8489
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('E-commerce');
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './pages/register/register';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('agendador-tarefas');
}

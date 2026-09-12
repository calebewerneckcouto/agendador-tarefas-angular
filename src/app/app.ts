import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from './shared/components/global/top-menu/top-menu';
import { FooterComponent } from './shared/components/global/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenu, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('agendador-tarefas');
}

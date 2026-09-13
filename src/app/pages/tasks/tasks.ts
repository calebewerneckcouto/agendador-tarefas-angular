import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule,MatButtonModule],
  selector: 'app-tasks',
  styleUrl: './tasks.scss',
  templateUrl: './tasks.html',
})
export class Tasks {}

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  imgHero = 'assets/imagem-hero.svg';

  constructor(private authService:Auth,private router:Router){
    
  }

    ngOnInit():void{
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/tasks'])
    }
  }
}

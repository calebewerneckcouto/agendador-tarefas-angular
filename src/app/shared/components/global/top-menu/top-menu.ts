import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  selector: 'app-top-menu',
  styleUrl: './top-menu.scss',
  templateUrl: './top-menu.html',
})
export class TopMenu implements OnInit, OnDestroy {

  appLogo = "assets/logo-agendador-javanauta.png"
  rotaAtual: string = '';
  inscricaoRota!: Subscription;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.rotaAtual = this.router.url
    this.inscricaoRota = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((evento: NavigationEnd) => {
        this.rotaAtual = evento.url
      })
  }


  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean{
    return this.rotaAtual === '/register'
  }
}

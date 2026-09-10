import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, RouterModule, RouterState } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state';

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

  private routerService = inject(RouterStateService);

  ngOnInit(): void {

    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual = url
    })
  }


  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean {
    return this.rotaAtual === '/register'
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule, RouterState } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state';
import { MatCardAvatar } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from '../../../../services/auth';
import { UserService } from '../../../../services/user';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, MatCardAvatar, MatMenuModule],
  selector: 'app-top-menu',
  styleUrl: './top-menu.scss',
  templateUrl: './top-menu.html',
})
export class TopMenu implements OnInit, OnDestroy {

  appLogo = "assets/logo-agendador-javanauta.png"
  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService);
  private authService = inject(Auth)
  private route = inject(Router)
  private userService = inject(UserService)

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


  estaNaRotaLogin(): boolean {
    return this.rotaAtual === '/login'
  }


  get estaLogado(): boolean {
    return this.authService.isLoggedIn();
  }


  pegarInicialUsuario():string{
    const token = this.authService.getToken() || ''
    this.userService.getEmailFromToken(token)
    return 'F'
  }


  logout(): void {
  this.authService.logout();
  this.route.navigate(['/login'])
  }
}

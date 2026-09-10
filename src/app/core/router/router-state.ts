import { Service, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Service()
export class RouterStateService {
  private readonly router = inject(Router);

  private rotaAtualSubject$ = new BehaviorSubject<string>('');
  public readonly rotaAtual$ = this.rotaAtualSubject$.asObservable();

  constructor() {
    this.rotaAtualSubject$.next(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((evento: NavigationEnd) => {
        this.rotaAtualSubject$.next(evento.url);
      });
  }
}

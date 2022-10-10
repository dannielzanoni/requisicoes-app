import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html'
})
export class PainelComponent implements OnInit, OnDestroy {
  emailUsuario?: string | null;

  usuarioLogado$: Subscription;

  constructor(
    titulo: Title,
    private authService: AuthenticationService,
    private router: Router
  ) {
    titulo.setTitle('Painel - RequisiçõesApp');
   }

  //setup
  ngOnInit(): void {
    this.usuarioLogado$ = this.authService.usuarioLogado
    .subscribe(usuario => this.emailUsuario = usuario?.email);
  }

  //cleanup
  ngOnDestroy(): void {
    this.usuarioLogado$.unsubscribe();
  }

  public sair(){
    this.authService.logout()
    .then(() => this.router.navigate(['/login']));
  }

}

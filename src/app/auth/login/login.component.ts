import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public formRecuperacao: FormGroup;
  public loading: boolean = false;

  constructor
    (
      private formBuilder: FormBuilder,
      private authService: AuthenticationService,
      private router: Router,
      private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl(""),
      senha: new FormControl("")
    })

    this.formRecuperacao = this.formBuilder.group({
      emailRecuperacao: new FormControl("")
    })

  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  get emailRecuperacao(): AbstractControl | null {
    return this.formRecuperacao.get("emailRecuperacao");
  }

  public abrirModalRecuperacao(modal: TemplateRef<any>) {
    this.modalService.open(modal)
      .result
      .then(resultado => {
        if (resultado === "enviar") {
          this.authService.resetarSenha(this.emailRecuperacao?.value);
        }
      })
      .catch(() => {
        this.formRecuperacao.reset();
      });
  }
  
  public async login() {
    const email = this.email?.value;
    const senha = this.senha?.value;

    if(!email || !senha){
      var popupEmail = document.getElementById('popup-email');
      popupEmail!.classList.remove('hidden');

      const currentWith = popupEmail?.offsetWidth;
      const newWith = currentWith! + 20;

      popupEmail!.style.width = newWith! + 'px';
    }

    this.loading = true;
    try {
      const resposta = await this.authService.login(email, senha);
      if (resposta?.user) {
        this.router.navigate(["/painel"]);
      }
      
    } catch (error) {
      this.loading = false;
      console.log(error);
      if(email && senha){
        var popup = document.getElementById('popup');
        popup!.classList.remove('hidden');
        
        const currentWith = popup?.offsetWidth;
        const newWith = currentWith! + 20;

        popup!.style.width = newWith! + 'px';
      }
    }
  }

  resetPopup() {
    var popup = document.getElementById('popup');
    var popupEmail = document.getElementById('popup-email');
    popup!.classList.add('hidden');
    popupEmail!.classList.add('hidden');
  }
}

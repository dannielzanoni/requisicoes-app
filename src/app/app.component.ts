import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Requisições';

  constructor(titulo: Title){
    titulo.setTitle("Início - RequisiçõesApp");
  }
}

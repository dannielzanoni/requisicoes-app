import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EquipamentoComponent } from './equipamento.component';
import { EquipamentoService } from './services/equipamento.service';


@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    EquipamentoRoutingModule,

    ReactiveFormsModule
  ],
  providers: [EquipamentoService]
})
export class EquipamentoModule { }

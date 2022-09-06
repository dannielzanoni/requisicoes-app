import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EquipamentoComponent } from './equipamento.component';
import { EquipamentoService } from './services/equipamento.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    EquipamentoRoutingModule,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  providers: [EquipamentoService]
})
export class EquipamentoModule { }

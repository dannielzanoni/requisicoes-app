import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl(""),
      nome: new FormControl(""),
      precoAquisicao: new FormControl(""),
      dataFabricacao: new FormControl(""),
    });

    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualizar" : "Cadastro";
  }

  get id(): AbstractControl | null{
    return this.form.get("id");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento){
    this.form.reset();

    if(equipamento)
      this.form.setValue(equipamento);

    try{
      await this.modalService.open(modal).result;

      if(!equipamento)
        await this.equipamentoService.inserir(this.form.value);
      else
        await this.equipamentoService.editar(this.form.value);

      this.toastrService.success('O equipamento foi salvo com sucesso!', "Cadastro de Equipamentos");
    }catch(error){
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar o equipamento. Tente Novamente.", "Cadastro de Equipamentos");
    }
  }

  public async excluir(equipamento: Equipamento){
    try{
      await this.equipamentoService.excluir(equipamento);

      this.toastrService.success('O equipamento foi excluído com sucesso!', "Cadastro de Equipamentos");
    }catch(error){
      console.log(error);
    }

  }

}

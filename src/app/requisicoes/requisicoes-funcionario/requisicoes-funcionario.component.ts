import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public departamentos$: Observable<Departamento[]>;
  private processoAutenticado$: Subscription;

  public funcionarioLogado: Funcionario;
  public form: FormGroup;

  constructor(
    titulo: Title,
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService : FuncionarioService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Requisições - RequisiçõesApp') ;
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      //ter as mesmas prioridades do requisicao.model.ts
      id: new FormControl(""),
      descricao: new FormControl(""),
      dataAbertura: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      movimentacoes: new FormControl("")

    })

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email = usuario?.email!;

      this.funcionarioService.selecionarFuncionarioLogado(email)
      .subscribe(funcionario => this.funcionarioLogado = funcionario);
    });
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
    this.configurarValoresPadrao();

    if(requisicao){
       const departamento = requisicao.departamento ? requisicao.departamento : null;
       const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
       const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

       const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento
       }

       this.form.setValue(requisicaoCompleta);
    }

    try{
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){
        if(!requisicao)
          await this.requisicaoService.inserir(this.form.value);
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success("A requisição foi salva com sucesso!", "Cadastro de Requisições");
      }
      else
        this.toastrService.error("Verifique o preenchimento do formulário e tente novamente.", "Cadastro de Requisições");
    }catch(error){
      this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente.", "Cadastro de Requisições");
    }
  }

  public async excluir(requisicao: Requisicao){
    try{
      await this.requisicaoService.excluir(requisicao);

      this.toastrService.success("A requisição foi excluída com sucesso!", "Cadastro de Requisições");
    }catch(error){
      this.toastrService.error("Houve um erro ao excluir a requisição", "Cadastro de Requisições")
    }
  }

  private configurarValoresPadrao(): void{
    this.form.get("status")?.setValue("Aberta");
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("ultimaAtualizacao")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);
  }
}

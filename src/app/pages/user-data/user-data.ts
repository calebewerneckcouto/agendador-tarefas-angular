import { Component, computed, inject, OnInit } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, Telefone, Endereco } from '../../services/user';
import { Auth } from '../../services/auth';
import { DialogFieldConfig, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardModule, MatButtonModule, MatFormFieldModule, MatInput, ReactiveFormsModule,MatListModule,MatIconModule],
  selector: 'app-user-data',
  styleUrl: './user-data.scss',
  templateUrl: './user-data.html',
})
export class UserData implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(Auth);
  readonly dialog = inject(MatDialog);

  readonly user = computed(() => this.authService.getUser() ?? this.userService.getUser());

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }],
  });

  formConfig: DialogFieldConfig[] = [
    { name: 'cep', label: 'CEP', validators: [Validators.required] },
    { name: 'rua', label: 'Rua' },
    { name: 'numero', label: 'Numero' },
    { name: 'complemento', label: 'Complemento' },
    { name: 'cidade', label: 'Cidade' },
    { name: 'estado', label: 'Estado' },
  ];

  telefoneFormConfig: DialogFieldConfig[] = [
    { name: 'ddd', label: 'DDD', validators: [Validators.required] },
    { name: 'numero', label: 'Número',validators: [Validators.required] },
  ];

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    this.userService.getUserByEmail(token).subscribe({
      next: (user) => this.authService.saveUser(user),
    });
  }

  cadastrarEndereco() {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    this.dialog.open(ModalDialog, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'app-modal-dialog-panel',
      data: { title: 'Adicionar endereço', formConfig: this.formConfig },
    }).afterClosed().subscribe((endereco) => {
      if (!endereco) {
        return;
      }

      this.userService.saveEndereco({
        rua: String(endereco['rua'] ?? ''),
        numero: String(endereco['numero'] ?? ''),
        complemento: String(endereco['complemento'] ?? ''),
        cidade: String(endereco['cidade'] ?? ''),
        estado: String(endereco['estado'] ?? ''),
        cep: String(endereco['cep'] ?? ''),
      }).pipe(
        switchMap(() => this.userService.getUserByEmail(token)),
      ).subscribe({
        next: (user) => {
          this.authService.saveUser(user);
          console.log('Endereço cadastrado com sucesso', endereco);
        },
        error: (error) => console.log('Erro ao cadastrar endereço', error),
      });
    });
  }

  editarEndereco(endereco: Endereco) {
    const token = this.authService.getToken();
    if (!token || endereco.id == null) {
      return;
    }

    const formConfig: DialogFieldConfig[] = [
      { name: 'cep', label: 'CEP', value: endereco.cep, validators: [Validators.required] },
      { name: 'rua', label: 'Rua', value: endereco.rua },
      { name: 'numero', label: 'Numero', value: endereco.numero },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade },
      { name: 'estado', label: 'Estado', value: endereco.estado },
    ];

    this.dialog.open(ModalDialog, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'app-modal-dialog-panel',
      data: { title: 'Editar endereço', formConfig },
    }).afterClosed().subscribe((dados) => {
      if (!dados) {
        return;
      }

      this.userService.updateEndereco(endereco.id as number, {
        rua: String(dados['rua'] ?? ''),
        numero: String(dados['numero'] ?? ''),
        complemento: String(dados['complemento'] ?? ''),
        cidade: String(dados['cidade'] ?? ''),
        estado: String(dados['estado'] ?? ''),
        cep: String(dados['cep'] ?? ''),
      }).pipe(
        switchMap(() => this.userService.getUserByEmail(token)),
      ).subscribe({
        next: (user) => {
          this.authService.saveUser(user);
          console.log('Endereço atualizado com sucesso', dados);
        },
        error: (error) => console.log('Erro ao atualizar endereço', error),
      });
    });
  }

  deletarEndereco(endereco: Endereco) {
    const token = this.authService.getToken();
    if (!token || endereco.id == null) {
      return;
    }

    this.userService.deleteEndereco(endereco.id).pipe(
      switchMap(() => this.userService.getUserByEmail(token)),
    ).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        console.log('Endereço deletado com sucesso', endereco);
      },
      error: () => console.log('Erro ao deletar endereço', endereco),
    });
  }

  cadastrarTelefone() {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    this.dialog.open(ModalDialog, {
      data: {
        title: 'Adicionar Telefone',
        formConfig: this.telefoneFormConfig,
      },
    }).afterClosed().subscribe((telefone) => {
      if (!telefone) {
        return;
      }

      this.userService.saveTelefone({
        ddd: String(telefone['ddd'] ?? ''),
        numero: String(telefone['numero'] ?? ''),
      }).pipe(
        switchMap(() => this.userService.getUserByEmail(token)),
      ).subscribe({
        next: (user) => {
          this.authService.saveUser(user);
          console.log('Telefone cadastrado com sucesso', telefone);
        },
        error: () => console.log('Erro ao cadastrar telefone', telefone),
      });
    });
  }


  alterarSenha() {
  this.dialog.open(ModalDialog, {
    width: '520px',
    maxWidth: '95vw',
    panelClass: 'app-modal-dialog-panel',
    data: {
      title: 'Alterar senha',
      formConfig: [
        { name: 'senha', label: 'Nova senha', type: 'password', validators: [Validators.required, Validators.minLength(6)] },
        { name: 'confirmarSenha', label: 'Confirmar senha', type: 'password', validators: [Validators.required, Validators.minLength(6)] },
      ],
    },
  }).afterClosed().subscribe((dados) => {
    if (!dados) {
      return;
    }

    const senha = String(dados['senha'] ?? '');
    const confirmarSenha = String(dados['confirmarSenha'] ?? '');

    if (senha !== confirmarSenha) {
      console.log('As senhas não coincidem');
      return;
    }

    this.userService.alteraSenha({ senha }).subscribe({
      next: () => console.log('Senha alterada com sucesso'),
      error: (error) => console.log('Erro ao alterar senha', error),
    });
  });
}



  editarTelefone(telefone: Telefone) {
    const token = this.authService.getToken();
    if (!token || telefone.id == null) {
      return;
    }

    const formConfig: DialogFieldConfig[] = [
      { name: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { name: 'numero', label: 'Número', value: telefone.numero, validators: [Validators.required] },
    ];

    this.dialog.open(ModalDialog, {
      data: {
        title: 'Editar Telefone',
        formConfig,
      },
    }).afterClosed().subscribe((dados) => {
      if (!dados) {
        return;
      }

      this.userService.updateTelefone(telefone.id as number, {
        ddd: String(dados['ddd'] ?? ''),
        numero: String(dados['numero'] ?? ''),
      }).pipe(
        switchMap(() => this.userService.getUserByEmail(token)),
      ).subscribe({
        next: (user) => {
          this.authService.saveUser(user);
          console.log('Telefone atualizado com sucesso', dados);
        },
        error: () => console.log('Erro ao atualizar telefone', dados),
      });
    });
  }

  deletarTelefone(telefone: Telefone) {
    const token = this.authService.getToken();
    if (!token || telefone.id == null) {
      return;
    }

    this.userService.deleteTelefone(telefone.id).pipe(
      switchMap(() => this.userService.getUserByEmail(token)),
    ).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        console.log('Telefone deletado com sucesso', telefone);
      },
      error: () => console.log('Erro ao deletar telefone', telefone),
    });
  }
}

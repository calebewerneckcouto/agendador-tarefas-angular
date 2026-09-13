import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserLoginPayload, UserService } from '../../services/user';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { Auth } from '../../services/auth';



@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent {
  isLoading = false;
  form: FormGroup<{email: FormControl<string>,senha:FormControl<string>}>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService:Auth,
  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control ('', { validators: [Validators.required, Validators.email],nonNullable:true}),
      senha: this.formBuilder.control ('', { validators: [Validators.required, Validators.minLength(6)],nonNullable:true}),
    });
  }

  ngOnInit():void{
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/tasks'])
    }
  }

  get emailErros(): string | null {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) return 'A informação do e-mail é obrigatorio';
    if (emailControl?.hasError('email')) return 'Este email é invalido';
    return null;
  }

  get senhaControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value as UserLoginPayload;

    this.isLoading = true;


    this.userService.login(formData).pipe(
      switchMap((token) => {
        this.authService.saveToken(token);
        return this.userService.getUserByEmail(token);
      }),
      finalize(() => (this.isLoading = false)),
    ).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error(`Erro ao fazer login`, error);
      },
    });
  }
}

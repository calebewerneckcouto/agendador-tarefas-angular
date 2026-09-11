import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField, ReactiveFormsModule, CommonModule,MatProgressSpinnerModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  isLoading=false;
  form: FormGroup;
  constructor(private formBuilder: FormBuilder,
     private userService: UserService,
     private router: Router

  ) {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  get senhaControl(): FormControl {
    return this.form.get('senha') as FormControl
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value;

    this.isLoading = true;

    this.userService.register(formData).pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next:(response) => {
        this.router.navigate(['/login'])
      },
      error:(error)=>{
        console.error(`Erro ao Registrar usuario`,error)
      }
      
    })

    
  }
}

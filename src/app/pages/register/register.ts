import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField, ReactiveFormsModule, CommonModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',Validators.required]
    });
  }

  get passwordControl():FormControl{
    return this.form.get('password') as FormControl
  }

  submit(){

      if(this.form.invalid){
        this.form.markAllAsTouched();
        return 
      }

    console.log("formulario submetido",this.form.value)
  }
}

import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule, MatAnchor } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  imports: [MatCardModule, MatAnchor, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, PasswordField,ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fullName: [''],
      email: [''],
      password: ['']
    });
  }

  get passwordControl():FormControl{
    return this.form.get('password') as FormControl
  }

  submit(){
    console.log(this.form.value)
  }
}

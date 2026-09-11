import { Component, Input, signal } from '@angular/core';
import { FormControl,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,ReactiveFormsModule],
  selector: 'app-password-field',
  styleUrl: './password-field.scss',
  templateUrl: './password-field.html',
})
export class PasswordField {
  hide = signal(true);

  @Input()placeholder: string = 'Digite a sua senha';

  get passwordErros(): string | null {
    return this.getPassworErros();
  }

  getPassworErros(): string | null {
    const passwordControl = this.control;
    if (passwordControl?.hasError('required')) return 'Senha é um campo obrigatório';
    if (passwordControl?.hasError('minlength')) return 'A senha deve conter com no minimo 6 digitos';
    return null;
  }

  @Input({required:true}) control!: FormControl;
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}

import { Component, inject } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardModule, MatCardActions } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Auth } from '../../services/auth';

@Component({
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardModule, MatCardActions, MatButtonModule, MatFormFieldModule, MatInput, ReactiveFormsModule],
  selector: 'app-user-data',
  styleUrl: './user-data.scss',
  templateUrl: './user-data.html',
})
export class UserData {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(Auth);

  user = this.userService.getUser() ?? this.authService.getUser();

  form = this.formBuilder.group({
    nome: [{ value: this.user?.nome || '', disabled: true }],
    email: [{ value: this.user?.email || '', disabled: true }],
  });
}

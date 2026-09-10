import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule, MatAnchor } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { PasswordField } from '../../shared/components/password-field/password-field';

@Component({
  imports: [MatCardModule, MatAnchor, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,PasswordField],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation:ViewEncapsulation.None
})
export class RegisterComponent {
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.
A small, agile dog that copes very well with mountainous terrain, and was originally bred for hunting.`;
}

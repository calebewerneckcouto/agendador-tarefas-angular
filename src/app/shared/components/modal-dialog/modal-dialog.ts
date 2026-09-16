import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { UserService } from '../../../services/user';

export interface DialogFieldConfig {
  name: string;
  label: string;
  value?: string | Date | number | null;
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'textarea';
  layout?: 'full' | 'half';
  validators?: ValidatorFn[];
}

export interface DialogData {
  title: string;
  formConfig: DialogFieldConfig[];
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  selector: 'app-modal-dialog',
  styleUrl: './modal-dialog.scss',
  templateUrl: './modal-dialog.html',
})
export class ModalDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  readonly dialogRef = inject(MatDialogRef<ModalDialog, Record<string, unknown>>);
  readonly data: DialogData = inject<DialogData>(MAT_DIALOG_DATA, { optional: true }) ?? {
    title: '',
    formConfig: [],
  };

  readonly fields: DialogFieldConfig[] = this.data.formConfig;
  readonly form: FormGroup = this.formBuilder.group(this.buildControls());

  private buildControls(): Record<string, [string | Date | number, ValidatorFn[]]> {
    const controls: Record<string, [string | Date | number, ValidatorFn[]]> = {};

    this.fields.forEach((field) => {
      controls[field.name] = [field.value ?? '', field.validators ?? []];
    });

    return controls;
  }

  inputType(field: DialogFieldConfig): string {
    if (field.type === 'datetime') {
      return 'datetime-local';
    }

    return field.type ?? 'text';
  }

  onCepInformado(fieldName: string): void {
    if (fieldName !== 'cep' || !this.form.contains('cep')) {
      return;
    }

    const cep = String(this.form.get('cep')?.value ?? '').replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    this.userService.buscarCep(cep).subscribe({
      next: (dados) => {
        this.form.patchValue({
          rua: dados.logradouro ?? '',
          complemento: dados.complemento || this.form.get('complemento')?.value,
          cidade: dados.localidade ?? '',
          estado: dados.uf ?? dados.estado ?? '',
        });
      },
      error: (error) => console.log('Erro ao buscar CEP', error),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}

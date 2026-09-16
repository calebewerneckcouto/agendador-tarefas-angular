import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DialogFieldConfig, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksPayload, TasksResponse, TasksService } from '../../services/tasks';

@Component({
  imports: [NgClass, MatCardModule, MatButtonModule, MatIconModule],
  selector: 'app-tasks',
  styleUrl: './tasks.scss',
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tasks {

  readonly dialog = inject(MatDialog);

  private tasksService = inject(TasksService)

  tasks = this.tasksService.tasks
  hasTasks = () => (this.tasks() ?? []).length > 0;

  cadastrarTarefa() {
    this.abrirFormularioTarefa('Adicionar Tarefa').subscribe(payload => {
      if (!payload) {
        return;
      }

      this.tasksService.createTask(payload).subscribe({
        next: () => console.log('Tarefa cadastrada com sucesso', payload),
        error: () => console.log('Erro ao cadastrar Tarefa', payload),
      });
    });
  }

  editarTarefa(task: TasksResponse) {
    if (!task.id) {
      return;
    }

    const evento = this.parseDataEvento(task.dataEvento);

    this.abrirFormularioTarefa('Editar Tarefa', {
      nomeTarefa: task.nomeTarefa,
      descricao: task.descricao,
      data: evento,
      tempo: evento,
    }).subscribe(payload => {
      if (!payload) {
        return;
      }

      this.tasksService.updateTask(task.id, payload).subscribe({
        next: () => console.log('Tarefa atualizada com sucesso', payload),
        error: () => console.log('Erro ao atualizar Tarefa', payload),
      });
    });
  }

  excluirTarefa(task: TasksResponse) {
    if (!task.id) {
      return;
    }

    const confirmar = window.confirm(`Excluir a tarefa "${task.nomeTarefa}"?`);
    if (!confirmar) {
      return;
    }

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => console.log('Tarefa excluída com sucesso', task),
      error: () => console.log('Erro ao excluir Tarefa', task),
    });
  }

  statusLabel(status?: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'NOTIFICADO':
        return 'Notificado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Sem status';
    }
  }

  statusClass(status?: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'task-status--pending';
      case 'NOTIFICADO':
        return 'task-status--notified';
      case 'CANCELADO':
        return 'task-status--cancelled';
      default:
        return 'task-status--pending';
    }
  }

  dataParte(valor?: string): string {
    if (!valor) {
      return '—';
    }
    const [data] = valor.split(' ');
    return data || valor;
  }

  horaParte(valor?: string): string {
    if (!valor) {
      return '';
    }
    const hora = valor.split(' ')[1];
    return hora ? hora.slice(0, 5) : '';
  }

  private abrirFormularioTarefa(
    title: string,
    valores?: { nomeTarefa?: string; descricao?: string; data?: Date | null; tempo?: Date | null },
  ): Observable<TasksPayload | undefined> {
    const formConfig: DialogFieldConfig[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa', value: valores?.nomeTarefa ?? '' },
      { name: 'data', label: 'Data da Tarefa', type: 'date', layout: 'half', value: valores?.data ?? '' },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time', layout: 'half', value: valores?.tempo ?? '' },
      { name: 'descricao', label: 'Descreva a tarefa', type: 'textarea', value: valores?.descricao ?? '' },
    ];

    return this.dialog.open(ModalDialog, {
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'app-modal-dialog-panel',
      autoFocus: 'first-tabbable',
      data: { title, formConfig },
    }).afterClosed().pipe(
      map(result => this.montarPayload(result)),
    );
  }

  private montarPayload(result: Record<string, unknown> | undefined): TasksPayload | undefined {
    if (!result) {
      return undefined;
    }

    const data = result['data'];
    const tempo = result['tempo'];
    if (!(data instanceof Date) || !(tempo instanceof Date)) {
      return undefined;
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const dataEvento =
      `${pad(data.getDate())}-${pad(data.getMonth() + 1)}-${data.getFullYear()} ` +
      `${pad(tempo.getHours())}:${pad(tempo.getMinutes())}:${pad(tempo.getSeconds())}`;

    return {
      nomeTarefa: String(result['nomeTarefa'] ?? ''),
      descricao: String(result['descricao'] ?? ''),
      dataEvento,
    };
  }

  private parseDataEvento(valor?: string): Date | null {
    if (!valor) {
      return null;
    }

    if (valor.includes('T') || /^\d{4}-/.test(valor)) {
      const iso = new Date(valor);
      return Number.isNaN(iso.getTime()) ? null : iso;
    }

    const [data, hora = '00:00:00'] = valor.split(' ');
    const [dia, mes, ano] = data.split('-').map(Number);
    const [horas, minutos, segundos] = hora.split(':').map(Number);
    const parsed = new Date(ano, mes - 1, dia, horas || 0, minutos || 0, segundos || 0);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

}

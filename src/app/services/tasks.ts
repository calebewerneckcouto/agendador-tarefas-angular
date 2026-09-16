import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Auth } from './auth';
import { Observable, tap } from 'rxjs';

export interface TasksResponse {
    id: string,
    nomeTarefa: string,
    descricao: string,
    dataCriacao: string,
    dataEvento: string,
    emailUsuario: string,
    dataAlteracao: string,
    statusNotificacaoEnum: 'PENDENTE'|'NOTIFICADO'|'CANCELADO'
}
export interface TasksPayload {
    nomeTarefa: string,
    descricao: string,
    dataEvento: string,
}

@Service()
export class TasksService {

 private apiUrl = 'http://localhost:8083';

private _tasks = signal<TasksResponse[] | null>(null);
readonly tasks = this._tasks.asReadonly(); 

private http = inject(HttpClient);
private authService = inject(Auth)

  constructor(){
    this.loadTasks()
  }
 

 private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({Authorization: `${token}`})
 }

 loadTasks():void{
    this.http.get<TasksResponse[]>(`${this.apiUrl}/tarefas`, {headers: this.getHeaders()}).subscribe({
        next: tasks => this._tasks.set(tasks),
        error:() => this._tasks.set([])
    })
 }
 createTask(body:TasksPayload):Observable<TasksResponse>{
    return this.http.post<TasksResponse>(`${this.apiUrl}/tarefas`,body, {headers: this.getHeaders()})
    .pipe(
        tap(()=> this.loadTasks())
    )
 }

 updateTask(id: string, body: TasksPayload): Observable<TasksResponse> {
    return this.http.put<TasksResponse>(`${this.apiUrl}/tarefas`, body, {
        headers: this.getHeaders(),
        params: { id },
    }).pipe(
        tap(() => this.loadTasks())
    )
 }

 deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tarefas`, {
        headers: this.getHeaders(),
        params: { id },
    }).pipe(
        tap(() => this.loadTasks())
    )
 }

}

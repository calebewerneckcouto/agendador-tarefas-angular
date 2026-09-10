import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

interface UserRegistryPayload {
    nome: string;
    email: string;
    senha: string;
}

@Service()
export class UserService {
    private readonly http = inject(HttpClient);
    private apiUrl = 'http://localhost:8083';

    register(body: UserRegistryPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/usuario`, body);
    }
}

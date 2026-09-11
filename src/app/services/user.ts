import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

interface UserRegistryPayload {
    nome: string,
    email: string,
    senha: string,
    enderecos?: [{
        rua: string,
        numero: number,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    }],
    telefone?: [{
        numero: string,
        ddd: string
    }
    ]

}

interface UserRegisterResponse {
    nome: string,
    email: string,
    enderecos: [{
        rua: string,
        numero: number,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    }
    ] | null,
    telefone: [{
        numero: string,
        ddd: string
    }
    ] | null
}

@Service()
export class UserService {
    private readonly http = inject(HttpClient);
    private apiUrl = 'http://localhost:8083';

    register(body: UserRegistryPayload): Observable<UserRegisterResponse> {
        return this.http.post<UserRegisterResponse>(`${this.apiUrl}/usuario`, body);
    }
}

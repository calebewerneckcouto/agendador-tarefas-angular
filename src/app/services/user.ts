import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


export interface UserLoginPayload {

    email: string,
    senha: string,


}


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

export interface UserResponse {
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

    private jwtHelper = new JwtHelperService();

    user = signal<UserResponse | null>(null)

    register(body: UserRegistryPayload): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body);
    }

    login(body: UserLoginPayload): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' }).pipe(
            map((token) => this.limparToken(token)),
        );
    }

    getUserByEmail(token: string): Observable<UserResponse> {
        const tokenLimpo = this.limparToken(token);
        const email = this.getEmailFromToken(tokenLimpo);
        console.log(tokenLimpo)

        if (!email) {
            throw new Error('Token Invalido!');
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${tokenLimpo}`,
           
        });

        return this.http.get<UserResponse>(`${this.apiUrl}/usuario`, {
            headers,
            params: { email },
             
        }).pipe(
            tap((user) => this.user.set(user)),
             
        );
    }

    getEmailFromToken(token: string): string | null {
        try {
            const decoded = this.jwtHelper.decodeToken(this.limparToken(token));
            return decoded?.sub || decoded?.email || null;
        } catch (error) {
            return null;
        }
    }

    private limparToken(token: string): string {
        let valor = (token ?? '').trim();
        if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
            valor = valor.slice(1, -1).trim();
        }
        if (valor.toLowerCase().startsWith('bearer ')) {
            valor = valor.slice(7).trim();
        }
        return valor;
    }


    getUser(): UserResponse | null {
        const user = this.user()
        return this.user()
    }

}

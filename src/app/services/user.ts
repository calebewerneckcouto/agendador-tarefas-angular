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

export interface Telefone {
    id?: number;
    numero: string;
    ddd: string;
}

export interface Endereco {
    id?: number;
    rua: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
    cep: string;
}

export interface ViaCepResponse {
    cep?: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    estado?: string;
}

export interface UserResponse {
    nome: string;
    email: string;
    enderecos?: Endereco[] | null;
    telefones?: Telefone[] | null;
    telefone?: Telefone[] | null;
}

export interface AlteraSenhaPayload{
    senha:string;
}

@Service()
export class UserService {
    private readonly http = inject(HttpClient);
    private apiUrl = 'http://localhost:8083';

    private jwtHelper = new JwtHelperService();

    private _user = signal<UserResponse | null>(null)
    readonly user = this._user.asReadonly();

    register(body: UserRegistryPayload): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body);
    }

    login(body: UserLoginPayload): Observable<string> {
        return this.http.post<string | Record<string, string>>(`${this.apiUrl}/usuario/login`, body).pipe(
            map((response) => this.limparToken(this.extrairToken(response))),
        );
    }

    getUserByEmail(token: string): Observable<UserResponse> {
        const tokenLimpo = this.limparToken(token);
        const email = this.getEmailFromToken(tokenLimpo);

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
            map((user) => this.normalizeUser(user)),
            tap((user) => this.setUser(user)),
        );
    }

    saveTelefone(body: { numero: string; ddd: string }): Observable<Telefone> {
        return this.http.post<Telefone>(`${this.apiUrl}/usuario/telefone`, body);
    }

    saveEndereco(body: Endereco): Observable<Endereco> {
        return this.http.post<Endereco>(`${this.apiUrl}/usuario/endereco`, body);
    }

    buscarCep(cep: string): Observable<ViaCepResponse> {
        const cepLimpo = cep.replace(/\D/g, '');
        return this.http.get<ViaCepResponse>(`${this.apiUrl}/usuario/endereco/${cepLimpo}`);
    }

    updateEndereco(id: number, body: Endereco): Observable<Endereco> {
        return this.http.put<Endereco>(`${this.apiUrl}/usuario/endereco`, body, {
            params: { id: String(id) },
        });
    }

    updateTelefone(id: number, body: { numero: string; ddd: string }): Observable<Telefone> {
        return this.http.put<Telefone>(`${this.apiUrl}/usuario/telefone`, body, {
            params: { id: String(id) },
        });
    }

    deleteTelefone(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/usuario/telefone`, {
            params: { id: String(id) },
        });
    }

    deleteEndereco(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/usuario/endereco`, {
            params: { id: String(id) },
        });
    }

    private normalizeUser(user: UserResponse): UserResponse {
        const telefones = user.telefones ?? user.telefone ?? [];
        const enderecos = user.enderecos ?? [];
        return { ...user, telefones, telefone: telefones, enderecos };
    }


    getEmailFromToken(token: string): string | null {
        try {
            const decoded = this.jwtHelper.decodeToken(this.limparToken(token));
            return decoded?.sub || decoded?.email || null;
        } catch (error) {
            return null;
        }
    }

    private extrairToken(response: string | Record<string, string> | null): string {
        if (response && typeof response === 'object') {
            return response['authorization'] ?? response['token'] ?? '';
        }

        const texto = (response ?? '').trim();
        if (texto.startsWith('{')) {
            try {
                const json = JSON.parse(texto) as Record<string, string>;
                return json['authorization'] ?? json['token'] ?? texto;
            } catch {
                return texto;
            }
        }

        return texto;
    }

    private limparToken(token: string): string {
        let valor = (token ?? '').trim();
        if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
            valor = valor.slice(1, -1).trim();
        }
        while (valor.toLowerCase().startsWith('bearer ')) {
            valor = valor.slice(7).trim();
        }
        return valor;
    }


    getUser(): UserResponse | null {
        const user = this.user()
        return this.user()
    }

    setUser(data: UserResponse | null):void {
       this._user.set(data)
    }


    alteraSenha(body:AlteraSenhaPayload):Observable<void>{
        return this.http.put<void>(`${this.apiUrl}/usuario/senha`,body);
    }

}

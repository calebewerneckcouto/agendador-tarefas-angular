import { computed, Service, signal } from '@angular/core';
import { UserResponse } from './user';

@Service()
export class Auth {

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER = 'logged_user';

    private readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
    private readonly currentUser = signal<UserResponse | null>(this.readStoredUser());

    readonly loggedIn = computed(() => !!this.token());

    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.token.set(token);
    }

    getToken(): string | null {
        return this.token();
    }

    saveUser(user: UserResponse): void {
        localStorage.setItem(this.USER, JSON.stringify(user));
        this.currentUser.set(user);
    }

    getUser(): UserResponse | null {
        return this.currentUser();
    }

    isLoggedIn(): boolean {
        return this.loggedIn();
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER);
        this.token.set(null);
        this.currentUser.set(null);
    }

    private readStoredUser(): UserResponse | null {
        const user = localStorage.getItem(this.USER);
        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user) as UserResponse;
        } catch {
            return null;
        }
    }
}

// src/app/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest  { email: string; password: string; }
export interface LoginResponse { token: string; user: { id: string; email: string }; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api  = 'http://localhost:1010/osms'; // Replace with your backend

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/serviceLogin/login`, body).pipe(
      tap(res => localStorage.setItem('auth_token', res.token))
    );
  }

  logout(): void        { localStorage.removeItem('auth_token'); }
  isLoggedIn(): boolean { return !!localStorage.getItem('auth_token'); }
}

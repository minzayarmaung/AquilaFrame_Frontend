// src/app/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../src/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username : string;
  email: string;
  password: string;
}

export interface LoginResponse { token: string; user: { id: string; email: string }; }

export interface Result {
  state: boolean;
  msgDesc: string;
  msgCode: string;           // "200", "500", …
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private api = this.baseUrl + '/loginController/login';

  /** POST credentials –> Result */
  login(body: LoginRequest): Observable<Result> {
    return this.http.post<Result>(this.api, body).pipe(
      tap(res => {
        if (res.state) sessionStorage.setItem('auth_state', 'true');
      })
    );
  }

  logout(): void        { localStorage.removeItem('auth_token'); }
  isLoggedIn(): boolean { return !!localStorage.getItem('auth_token'); }
}

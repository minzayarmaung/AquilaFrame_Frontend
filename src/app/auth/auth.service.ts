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
  msgCode: string | null;
  msgDesc: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private loginApi = this.baseUrl + '/loginController/login';
  private signupApi = this.baseUrl + '/signupController/signup'

  login(body: LoginRequest): Observable<Result> {

    // To Clean the Old Token.
    localStorage.removeItem('auth_token');
    return this.http.post<Result>(this.loginApi, body).pipe(
      tap(res => {
        if (res.state) sessionStorage.setItem('auth_state', 'true');
        localStorage.setItem('auth_token', res.token);
      })
    );
  }

  signup(body: SignupRequest): Observable<Result> {
    localStorage.removeItem('auth_token');
    return this.http.post<Result>(this.signupApi, body).pipe(
      tap(res => {
        if (res.state) sessionStorage.setItem('auth_state', 'true');
      })
    );
  }

  logout(): void { localStorage.removeItem('auth_token'); }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }

}

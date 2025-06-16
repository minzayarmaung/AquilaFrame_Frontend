import { environment } from './../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-signup-code',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './verify-signup-code.component.html',
  styleUrl: './verify-signup-code.component.css'
})
export class VerifySignupCodeComponent {
  isVerifying = false;

  email: string = '';
  code: string = '';
  username: string = '';
  password: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { email: string , username : string , password : string};
    this.email = state?.email || '';
    this.username = state?.username || '';
    this.password = state?.password || '';
  }

  resendCode() {
    throw new Error('Method not implemented.');
    }

  verifyCode() {
    this.message = null;
    this.error = null;

    this.http.post<any>(environment.apiBaseUrl + '/signupController/verifySignupCode', {
      email: this.email,
      username : this.username,
      password : this.password,
      code: this.code,
    }).subscribe({
      next: (res) => {
        if (res.state) {
          localStorage.setItem('reset_email', this.email); // store temporarily
          this.router.navigate(['/login']);
        } else {
          this.error = res.msgDesc;
        }
      },
      error: (err) => {
        this.error = err.error?.msgDesc || 'Verification failed.';
      }
    });
  }
}

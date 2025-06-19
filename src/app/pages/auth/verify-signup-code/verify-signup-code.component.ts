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
  loading = false;
  isVerifying = false;
  resendDisabled = false;
  resendTimer: number = 0;
  resendInterval: any;

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
  if (this.resendDisabled) return;

  this.resendDisabled = true;
  this.resendTimer = 90;

  //Optional: call resend API here if needed
  this.http.post<any>(environment.apiBaseUrl + '/signupController/resendSignupCode', {
    email: this.email
  }).subscribe({
    next: (res) => {
      if (res.state) {
        this.message = "Verification code Resent Successfully!";
      } else {
        this.error = res.msgDesc;
      }
    },
    error: () => {
      this.error = "Failed to resend code.";
    }
  });

  // Start countdown
  this.resendInterval = setInterval(() => {
    this.resendTimer--;

    if (this.resendTimer <= 0) {
      this.resendDisabled = false;
      clearInterval(this.resendInterval);
    }
  }, 1000);
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
          setTimeout(() => {
          this.router.navigate(['/login']);
          }, 6000); // wait 2 sec
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

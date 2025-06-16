import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-reset-code',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './verify-reset-code.component.html',
  styleUrl: './verify-reset-code.component.css'
})
export class VerifyResetCodeComponent {
  email: string = '';
  code: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  verifyCode() {
    this.message = null;
    this.error = null;

    this.http.post<any>(environment.apiBaseUrl + '/authController/verifyResetCode', {
      email: this.email,
      code: this.code,
    }).subscribe({
      next: (res) => {
        if (res.state) {
          localStorage.setItem('reset_email', this.email); // store temporarily
          this.router.navigate(['/reset-password']);
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

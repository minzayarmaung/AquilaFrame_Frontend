import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
password: string = '';
  confirmPassword: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    this.message = null;
    this.error = null;

    const email = localStorage.getItem('reset_email');
    if (!email) {
      this.error = 'Missing email. Please restart the process.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.http.post<any>(environment.apiBaseUrl + '/authController/resetPassword', {
      email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.state) {
          localStorage.removeItem('reset_email');
          this.message = 'Password reset successful.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.error = res.msgDesc;
        }
      },
      error: (err) => {
        this.error = err.error?.msgDesc || 'Reset failed.';
      }
    });
  }
}

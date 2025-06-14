import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private baseUrl = environment.apiBaseUrl;

  email: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient ,  private router: Router) {}

sendResetLink() {
  this.message = null;
  this.error = null;

  if (!this.email) {
    this.error = 'Please enter your email.';
    return;
  }

  const payload = { email: this.email };

  this.http.post<any>(this.baseUrl + '/authController/forgotPassword', payload).subscribe({
    next: (res) => {
      if (res.state) {
        this.message = res.msgDesc;
        localStorage.setItem('reset_email', this.email);
        this.router.navigate(['/verify-code']);
      } else {
        this.error = res.msgDesc || 'Reset failed.';
      }
    },
    error: (err) => {
      this.error = err.error?.msgDesc || 'Failed to send reset email.';
    }
  });
}


}

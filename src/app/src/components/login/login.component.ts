import { LoginRequest } from './../../../auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Result } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

submit(): void {
  this.error.set(null);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { email, password } = this.form.value;

  if (!email || !password) {
    this.error.set('Email and password are required.');
    return;
  }

  const loginData: LoginRequest = {
    email,
    password
  };

  this.auth.login(loginData).subscribe({
    next: (res: Result) => {
      if (res.state) {
        this.router.navigateByUrl('/home');
      } else {
        this.error.set(`${res.msgDesc} (code ${res.msgCode})`);
      }
    },
    error: () => this.error.set('Could not reach server')
  });
}
}

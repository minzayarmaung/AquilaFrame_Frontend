import { Component, inject, signal } from '@angular/core';
import { AuthService, LoginRequest, Result, SignupRequest } from '../../../auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomValidators } from '../../services/customValidators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule , RouterModule , CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

[x: string]: any;
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  form = this.fb.group({
    username : ['' , [Validators.required, CustomValidators.userNameLength ]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

submit(): void {
  this.error.set(null);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }


  const { username, email, password } = this.form.value;

  if (!username || !email || !password) {
    this.error.set('Username , Email and password are required.');
    return;
  }

  const loginData: SignupRequest = {
    username,
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

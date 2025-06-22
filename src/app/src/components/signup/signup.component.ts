import { Component, inject, signal } from '@angular/core';
import { AuthService, SignupRequest, Result } from '../../../auth/auth.service';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../services/customValidators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  loading = false;
  showPassword = false;
  showPassword1 = false;
  error = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  passwordMatchValidator: ValidatorFn = (group): { [key: string]: any } | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };

  form = this.fb.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.strongPassword()]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

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

    const signupData: SignupRequest = {
      username,
      email,
      password
    };

    this.auth.signup(signupData).subscribe({
    next: (res: Result) => {
      if (res.state) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/verify-signup-code'], {
            state: { email , username , password } 
          });
        }, 1000);
      } else {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.error.set(`${res.msgDesc} (code ${res.msgCode})`);
          }, 2000); 
      }
    },
      error: () => this.error.set('Could not reach server')
    });
  }
}

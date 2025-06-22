import { LoginRequest } from './../../../auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Result } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
   animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ])
  ]
})
export class LoginComponent {
showPassword: boolean = false;
loading = false;
[x: string]: any;
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
      localStorage.setItem('loggedIn', 'true');
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/home'], {
          state: { email, password }
        });
      }, 4000); // wait 4 sec
    } else {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.error.set(`${res.msgDesc} (code ${res.msgCode})`);
      }, 2000); // wait 2 sec
    }
  },
  error: () => this.error.set('Could not reach server')
});
}
}

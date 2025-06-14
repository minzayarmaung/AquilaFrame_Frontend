import { Routes } from '@angular/router';
import { LoginComponent } from './src/components/login/login.component';
import { HomeComponent } from './src/components/home/home.component';
import { SignupComponent } from './src/components/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './src/components/dashboard/dashboard.component';
import { VerifyResetCodeComponent } from './pages/auth/verify-reset-code/verify-reset-code.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent  },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-code', component: VerifyResetCodeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // ✅ Wildcard route must be last
  { path: '**', redirectTo: 'login' }
];


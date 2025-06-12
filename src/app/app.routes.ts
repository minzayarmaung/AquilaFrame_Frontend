import { Routes } from '@angular/router';
import { LoginComponent } from './src/components/login/login.component';
import { HomeComponent } from './src/components/home/home.component';
import { SignupComponent } from './src/components/signup/signup.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent  },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // ✅ Wildcard route must be last
  { path: '**', redirectTo: 'login' }
];


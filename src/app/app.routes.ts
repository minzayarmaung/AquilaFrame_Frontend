import { Routes } from '@angular/router';
import { LoginComponent } from './src/components/login/login.component';
import { HomeComponent } from './src/components/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home',  component: HomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

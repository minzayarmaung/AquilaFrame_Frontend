import { Component } from '@angular/core';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string = ''; 
  userdata: any = {}; 
  email: string = '';
  password: string = '';
  private baseUrl = environment.apiBaseUrl;
  logout() { localStorage.removeItem('auth_token'); location.href = '/login'; }
  title = 'admin-dashboard';
  isSidebarClosed = false;

  constructor(private http: HttpClient , private router: Router){
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { email?: string; password?: string };

    if (state?.email) {
      this.email = state.email;
    }
    if (state?.password) {
      this.password = state.password;
    }

  }

  ngOnInit(){
    this.getUserData();
  }

  getUserData(){
    const payload = { email: this.email };

    this.http.post<any>(this.baseUrl + '/userController/getUserData' , payload).subscribe({
      next: (res) => {
        this.userdata = res;
        this.username = res.username;
      },
      error: (err) => {
        console.log('Error Getting Userdata',err);
      }
    })
  }

  handleSidebarToggle(isClosed: boolean) {
    this.isSidebarClosed = isClosed;
  }

  openSettingsModal() {
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {
      keyboard: false
    });
    settingsModal.show();
  }
}

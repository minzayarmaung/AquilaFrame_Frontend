import { Component } from '@angular/core';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  logout() { localStorage.removeItem('auth_token'); location.href = '/login'; }
   title = 'admin-dashboard';
  isSidebarClosed = false;

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

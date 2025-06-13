import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./src/components/navbar/navbar.component";
import { SidebarComponent } from "./src/components/sidebar/sidebar.component";
import { DashboardComponent } from "./src/components/dashboard/dashboard.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'osms_frontend';

}

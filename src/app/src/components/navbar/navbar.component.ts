import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
@Input() username: string = ''; 

  constructor(private http: HttpClient ,  private router: Router) {}

  logout(event?: Event) {
    if (event) event.preventDefault();
    localStorage.removeItem('loggedIn');
    localStorage.clear(); // clears everything
    this.router.navigate(['/login']);
  }

}

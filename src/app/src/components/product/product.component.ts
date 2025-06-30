import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { UserListComponent } from "../user-roles/user-list/user-list.component";
import { ProductListComponent } from "./product-list/product-list.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, UserListComponent, ProductListComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

}

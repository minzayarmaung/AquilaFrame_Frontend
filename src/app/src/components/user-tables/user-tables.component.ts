import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CreateTableComponent } from "./create-table/create-table.component";
import { TableListComponent } from "./table-list/table-list.component";


@Component({
  selector: 'app-user-tables',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, CommonModule, CreateTableComponent, TableListComponent],
  templateUrl: './user-tables.component.html',
  styleUrl: './user-tables.component.css'
})
export class UserTablesComponent {

}

import { CommonModule } from '@angular/common';
import { Component, inject, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, NavbarComponent, UserListComponent],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent {

}

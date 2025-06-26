import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles, RoleService } from '../../services/role.server';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent implements OnInit {
private fb     = inject(FormBuilder);

form = this.fb.group({
    name: ['', Validators.required],
    permissions: this.fb.array([])
  });

  allPermissions = ['VIEW_DASHBOARD', 'CREATE_USER', 'DELETE_SALES'];

  constructor(private roleService: RoleService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onCheckboxChange(e: any) {
    const permissions: FormArray = this.form.get('permissions') as FormArray;

    if (e.target.checked) {
      permissions.push(new FormControl(e.target.value));
    } else {
      const i = permissions.controls.findIndex(x => x.value === e.target.value);
      permissions.removeAt(i);
    }
  }

submit() {
  const raw = this.form.getRawValue();

  const payload: Roles = {
    name: raw.name ?? '',
    permissions: raw.permissions as string[],
  };

  this.roleService.createRole(payload).subscribe(console.log);
}

}

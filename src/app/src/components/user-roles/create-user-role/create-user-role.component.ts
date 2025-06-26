import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles, RoleService } from '../../../services/role.server';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user-role',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './create-user-role.component.html',
  styleUrl: './create-user-role.component.css'
})
export class CreateUserRoleComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    roles: this.fb.array([]),
  });

  allRoles = ['ADMIN', 'USER', 'SALES_PERSON'];

  onCheckboxChange(e: any) {
    const roles = this.form.get('roles') as FormArray;

    if (e.target.checked) {
      roles.push(new FormControl(e.target.value));
    } else {
      const i = roles.controls.findIndex(x => x.value === e.target.value);
      roles.removeAt(i);
    }
  }

  submit() {
    // Submit new user logic here
  }
}

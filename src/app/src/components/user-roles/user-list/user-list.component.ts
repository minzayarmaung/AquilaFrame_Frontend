import { Component, inject, NgModule } from '@angular/core';
import { User, UserService } from '../../../services/UserService';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.map(user => {
        const role = this.getRole(user.n1);
        const createdDate = this.parseDate(user.createddate);
        const today = new Date();
        const usageAge = this.getUsageAge(createdDate, today);
        return { ...user, usageAge , role };
      });
    });
  }

  getRole(role: number): any {
    if(role == 1){
      return 'Admin';

    } else if(role == 2){
      return 'User'

    } else {
      return 'Sales Person'
    }
  }

    // Convert 'yyyyMMdd' to Date
  parseDate(yyyymmdd: string): Date {
    const year = +yyyymmdd.substring(0, 4);
    const month = +yyyymmdd.substring(4, 6) - 1; // month is 0-based
    const day = +yyyymmdd.substring(6, 8);
    return new Date(year, month, day);
  }

  // Calculate difference as 'X years Y months Z days'
  getUsageAge(start: Date, end: Date): string {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}y ${months}m ${days}d`;
  }
}

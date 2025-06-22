import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTableComponent } from '../create-table/create-table.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Result } from '../../../../auth/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, CreateTableComponent],
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.css'
})
export class TableListComponent {
isDeleting = false;
showDeleteModal = false;
selectedTable: string | null = null;
private baseUrl = environment.apiBaseUrl;
isUpdate: boolean = false;
tables: string[] = [];
showCreateModal = false;

  constructor(private http: HttpClient) {
    this.fetchTables();
  }

openEditModal(tableName: string) {
  this.isUpdate = false;
  setTimeout(() => {
    this.isUpdate = true;
    this.selectedTable = tableName;
    this.showCreateModal = true;
  });
}


ngOnInit() {
  this.fetchTables();
}

fetchTables() {
  this.http.get<string[]>(this.baseUrl + '/tableController/showTables').subscribe({
    next: (res) => {
      this.tables = res;
    },
    error: (err) => {
      console.error('Error loading tables', err);
    }
  });
}


openCreateModal() {
  this.isUpdate = false; 
  this.selectedTable = null;
  this.showCreateModal = true;
}

onTableCreated() {
  this.showCreateModal = false;
  this.fetchTables(); 
}

confirmDelete(table: string) {
  this.selectedTable = table;
  this.showDeleteModal = true;
  }

cancelDelete() {
  this.selectedTable = null;
  this.showDeleteModal = false;
}

deleteTable() {
  this.isDeleting = true;

  setTimeout(() => {
    this.http.post<Result>(this.baseUrl + '/tableController/deleteTable', { tableName: this.selectedTable }).subscribe({
      next: (res) => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.fetchTables(); 
      },
      error: (err) => {
        this.isDeleting = false;
        console.error('Error deleting table:', err);
      }
    });
  }, 2000);
}

}

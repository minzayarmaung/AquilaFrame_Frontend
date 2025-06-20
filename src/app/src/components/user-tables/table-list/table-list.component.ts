import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTableComponent } from '../create-table/create-table.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, CreateTableComponent],
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.css'
})
export class TableListComponent {
private baseUrl = environment.apiBaseUrl;
tables: string[] = [];
showCreateModal = false;

constructor(private http: HttpClient) {}

ngOnInit() {
  this.fetchTables();
}

fetchTables() {
  this.http.get<string[]>(this.baseUrl + '/tableController/showTables').subscribe({
    next: (res) => this.tables = res,
    error: (err) => console.error('Error loading tables', err)
  });
}

onTableCreated() {
  this.showCreateModal = false;
  this.fetchTables(); // Refresh after new table created
}

}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Result } from '../../../../auth/auth.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-table',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './create-table.component.html',
  styleUrl: './create-table.component.css'
})
export class CreateTableComponent {
  @Output() tableCreated = new EventEmitter<void>();
  isSubmitting = false;
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  private baseUrl = environment.apiBaseUrl;
  tableForm: FormGroup;
    dataTypes = ['VARCHAR', 'TEXT', 'INT', 'BIGINT', 'BOOLEAN', 'DATE', 'TIMESTAMP'];
    message: string = '';
    error: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.tableForm = this.fb.group({
      tableName: ['', Validators.required],
      columns: this.fb.array([
        this.fb.group({ name: ['', Validators.required], type: ['', Validators.required] , isPrimaryKey: [false] , isNotNull : [false]})
      ])
    });
  }

  get columns(): FormArray {
    return this.tableForm.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.group({ name: ['', Validators.required], type: ['', Validators.required] , isPrimaryKey: [false] , isNotNull : [false] }));
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

createTable() {
  if (this.tableForm.invalid || this.isSubmitting) return;

  const columnNames = this.columns.controls.map(c => c.get('name')?.value?.trim());
  const duplicates = columnNames.filter((name, idx) => columnNames.indexOf(name) !== idx);

  if (duplicates.length > 0) {
    this.alertType = 'error';
    this.alertMessage = `Duplicate column names: ${[...new Set(duplicates)].join(', ')}`;
    this.showAlert = true;
    this.isSubmitting = false;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);

    return;
  }

  // Continue normally
  this.isSubmitting = true;
  this.alertMessage = 'Creating Table';
  this.alertType = 'success';
  this.showAlert = true;

  setTimeout(() => {
    this.http.post<Result>(this.baseUrl + '/tableController/createTable', this.tableForm.value).subscribe({
      next: (res) => {
        this.alertType = res.state ? 'success' : 'error';
        this.alertMessage = res.msgDesc || (res.state ? 'Table created successfully!' : 'Failed to create table.');

        if (res.state) {
          this.tableCreated.emit(); 
          this.tableForm.reset();
          this.columns.clear();
          this.addColumn();
        }

        this.showTemporaryAlert();
      },
      error: (err) => {
        this.alertType = 'error';
        this.alertMessage = err.error?.msgDesc || 'Error creating table.';
        this.showTemporaryAlert();
      }
    });
  }, 3000);
}




showTemporaryAlert() {
  this.showAlert = true;

  setTimeout(() => {
    this.showAlert = false;
    this.isSubmitting = false;
  }, 3000); // show the success/fail message for 3 seconds
}

}

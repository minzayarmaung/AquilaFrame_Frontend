import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";

export interface User {
  id: number;
  username: string;
  email: string;
  createddate: string;
  enabled: boolean;
  roles: string[];
  usageDays: number;
  status: boolean;
  usageAge?: string; // Added optional property for calculated usage age
  n1: number;
  role?: string;

}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = environment.apiBaseUrl + '/userController/getAllUsers';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(this.api);
  }
}

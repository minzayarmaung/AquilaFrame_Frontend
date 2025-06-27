import { environment } from './../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  createddate: string;
  enabled: boolean;
  roles: string[];
  usageDays: number;
  status: number;
  usageAge?: string; // Added optional property for calculated usage age
  n1: number;
  role?: string;
  userStatus?: boolean;
  profileImageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class userService {
  private baseUrl = environment.apiBaseUrl;
  private api = environment.apiBaseUrl + '/userController/getAllUsers';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(this.api);
  }

  searchUsers(keyword: string): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + `/userController/searchUser?searchVal=${keyword}`);
}

}

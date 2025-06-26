import { environment } from './../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Result } from '../../auth/auth.service';

export interface Roles {
  name: string | null;
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private baseUrl = environment.apiBaseUrl;

  private api = this.baseUrl +  '/api/admin/roles';

  constructor(private http: HttpClient) {}

  getAllRoles() {
    return this.http.get<Roles[]>(this.api);
  }

  createRole(role: Roles) {
    return this.http.post<Roles>(this.api, role);
  }
}

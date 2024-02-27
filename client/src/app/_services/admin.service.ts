import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getUsersWithRoles$() {
    return this._http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles$(username: string, roles: string) {
    return this._http.post<string[]>(
      this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles,
      {}
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private _currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUserSource.asObservable();

  constructor(
    private _http: HttpClient,
    private _presenceService: PresenceService
  ) {}

  login(model: any) {
    return this._http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((ressponse: User) => {
        const user = ressponse;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this._http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this._currentUserSource.next(user);
    this._presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this._currentUserSource.next(null);
    this._presenceService.stopHubConnection();
  }

  getDecodedToken(token: string): { role: string | string[] } {
    return JSON.parse(atob(token.split('.')[1]));
  }
}

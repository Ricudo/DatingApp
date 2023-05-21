import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = 'http://localhost:5200/api/';
  private _currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((ressponse: User) => {
        const user = ressponse;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this._currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    this._currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this._currentUserSource.next(null);
  }
}

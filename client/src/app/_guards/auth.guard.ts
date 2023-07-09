import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _toaster: ToastrService
  ) {}
  canActivate(): Observable<boolean> {
    return this._accountService.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this._toaster.error('You shall not pass!');
          return false;
        }
      })
    );
  }
}

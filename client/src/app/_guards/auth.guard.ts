import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toaster = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        toaster.error('You shall not pass!');
        return false;
      }
    })
  );
};

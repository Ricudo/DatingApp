import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  model: any = {};

  constructor(public accountService: AccountService, private _router: Router) {}

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this._router.navigateByUrl('/members');
        this.model = {};
      },
    });
  }

  logout() {
    this.accountService.logout();
    this._router.navigateByUrl('/');
  }
}

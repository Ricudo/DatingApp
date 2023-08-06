import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
})
export class ServerErrorComponent {
  error: any;

  constructor(private _router: Router) {
    const navigation = this._router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }
}

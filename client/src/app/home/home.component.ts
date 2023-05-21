import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.http.get('http://localhost:5200/api/users').subscribe({
      next: (resp) => (this.users = resp),
      error: (error) => console.log(error),
      complete: () => console.log('Request is completed!'),
    });
  }

  cancelRegister(event: boolean) {
    this.registerMode = event;
  }
}

import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private _hubConnection?: HubConnection;
  private _onlineUsersSource$ = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this._onlineUsersSource$.asObservable();

  constructor(private _toastr: ToastrService, private _router: Router) {}

  createHubConnection(user: User) {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection.start().catch((error) => console.log(error));

    this._hubConnection.on('UserIsOnline', (username) => {
      const onlineUsers = [...this._onlineUsersSource$.value];
      onlineUsers.push(username);
      this._onlineUsersSource$.next(onlineUsers);
    });

    this._hubConnection.on('UserIsOffline', (username) => {
      const onlineUsers = this._onlineUsersSource$.value.filter(
        (name) => name !== username
      );
      this._onlineUsersSource$.next(onlineUsers);
    });

    this._hubConnection.on('GetOnlineUsers', (usernames) => {
      this._onlineUsersSource$.next(usernames);
    });

    this._hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this._toastr
        .info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap.pipe(take(1))
        .subscribe({
          next: () =>
            this._router.navigateByUrl(
              '/members/' + username + '?tab=Messages'
            ),
        });
    });
  }

  stopHubConnection() {
    this._hubConnection?.stop().catch((error) => console.log(error));
  }
}

import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private _hubConnection?: HubConnection;
  private _onlineUsersSource$ = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this._onlineUsersSource$.asObservable();

  constructor(private _toastr: ToastrService) {}

  createHubConnection(user: User) {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection.start().catch((error) => console.log(error));

    this._hubConnection.on('UserIsOnline', (username) => {
      this._toastr.info(username + ' has connected');
    });

    this._hubConnection.on('UserIsOffline', (username) => {
      this._toastr.warning(username + ' has disconnected');
    });

    this._hubConnection.on('GetOnlineUsers', (usernames) => {
      this._onlineUsersSource$.next(usernames);
    });
  }

  stopHubConnection() {
    this._hubConnection?.stop().catch((error) => console.log(error));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult$, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private _hubConnection?: HubConnection;
  private _messsageThreadSource$ = new BehaviorSubject<Message[]>([]);
  messageThread$ = this._messsageThreadSource$.asObservable();

  constructor(private _http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string) {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection.start().catch((error) => console.log(error));

    this._hubConnection.on('ReceiveMessageThread', (messages) => {
      this._messsageThreadSource$.next(messages);
    });

    this._hubConnection.on('NewMessage', (message) => {
      const currentMessages = [...this._messsageThreadSource$.value];
      currentMessages.push(message);
      this._messsageThreadSource$.next(currentMessages);
    });
  }

  stopHubConnection() {
    this._hubConnection?.stop();
  }

  getMessages$(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult$<Message[]>(
      this.baseUrl + 'messages',
      params,
      this._http
    );
  }

  getMessageThread$(username: string) {
    return this._http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  async sendMessage(username: string, content: string) {
    return this._hubConnection
      ?.invoke('SendMessage', {
        recipientUsername: username,
        content,
      })
      .catch((error) => console.log(error));
  }

  deleteMessage$(id: number) {
    return this._http.delete(this.baseUrl + 'messages/' + id);
  }
}

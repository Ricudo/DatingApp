import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private _http: HttpClient) {}

  getMembers$() {
    if (this.members.length > 0) return of(this.members);
    return this._http.get<Member[]>(this.baseUrl + 'users').pipe(
      tap((members) => {
        this.members = members;
      })
    );
  }

  getMember$(username: string) {
    const member = this.members.find((x) => x.userName == username);
    if (member) return of(member);
    return this._http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember$(member: Member) {
    return this._http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { tap, of, take } from 'rxjs';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult$, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  private _userParams: UserParams | undefined;

  public get userParams(): UserParams {
    return this._userParams as UserParams;
  }

  public set userParams(params: UserParams) {
    this._userParams = params;
  }

  constructor(
    private _http: HttpClient,
    private _accountService: AccountService
  ) {
    this._accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userParams = new UserParams(user);
        }
      },
    });
  }

  getMembers$(userParams: UserParams) {
    const key = this._getCacheKey(userParams);
    const response = this.memberCache.get(key);
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult$<Member[]>(
      this.baseUrl + 'users',
      params,
      this._http
    ).pipe(
      tap((response) => {
        this.memberCache.set(key, response);
      })
    );
  }

  getMember$(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);

    if (member) {
      return of(member);
    }

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

  setMainPhoto$(photoId: number) {
    return this._http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto$(photoId: number) {
    return this._http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike$(username: string) {
    return this._http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes$(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult$<Member[]>(
      this.baseUrl + 'likes',
      params,
      this._http
    );
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  private _getCacheKey(userParams: UserParams): string {
    return Object.values(userParams).join('-');
  }
}

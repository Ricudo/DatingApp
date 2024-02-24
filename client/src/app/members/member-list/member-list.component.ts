import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  //members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private _memberService: MembersService) {
    this.userParams = this._memberService.userParams;
  }

  ngOnInit(): void {
    //this.members$ = this._memberService.getMembers$();
    if (this.userParams) {
      this._loadMembersFromUserParams(this.userParams);
    }
  }

  public loadMembers(): void {
    if (this.userParams) {
      this._loadMembersFromUserParams(this.userParams);
    }
  }

  resetFilter() {
    this.userParams = this._memberService.resetUserParams();
    if (this.userParams) {
      this._loadMembersFromUserParams(this.userParams);
    }
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this._memberService.userParams = this.userParams;
      this._loadMembersFromUserParams(this.userParams);
    }
  }

  private _loadMembersFromUserParams(userParams: UserParams) {
    this._memberService.userParams = userParams;
    if (
      this.pagination &&
      userParams.pageNumber !== this.pagination.currentPage
    ) {
      this.pagination.currentPage = userParams.pageNumber;
    }

    this._memberService.getMembers$(userParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      },
    });
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryModule } from 'ng-gallery';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [
    CommonModule,
    TabsModule,
    GalleryModule,
    TimeagoModule,
    MemberMessagesComponent,
  ],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  user?: User;

  constructor(
    public presenceService: PresenceService,
    private _messageService: MessageService,
    private _accountService: AccountService,
    private _route: ActivatedRoute
  ) {
    this._accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    this._route.data.subscribe({
      next: (data) => (this.member = data['member']),
    });

    this._route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });

    this.getImages();
  }

  ngOnDestroy(): void {
    this._messageService.stopHubConnection();
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const tab = this.memberTabs.tabs.find((x) => x.heading === heading);
      if (tab) {
        tab.active = true;
      }
    }
  }

  onTabActiveted(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this._messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this._messageService.stopHubConnection();
    }
  }

  loadMessages() {
    if (this.member) {
      this._messageService.getMessageThread$(this.member.userName).subscribe({
        next: (messages) => (this.messages = messages),
      });
    }
  }

  getImages() {
    if (!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}

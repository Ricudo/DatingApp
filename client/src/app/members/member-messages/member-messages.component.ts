import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  standalone: true,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  imports: [CommonModule, TimeagoModule, FormsModule],
})
export class MemberMessagesComponent {
  @Input() username?: string;
  messageContent = '';

  constructor(public messageService: MessageService) {}

  sendMessage(messageForm: NgForm) {
    if (!this.username) return;

    this.messageService
      .sendMessage(this.username, this.messageContent)
      .then(() => {
        messageForm.reset();
      });
  }
}

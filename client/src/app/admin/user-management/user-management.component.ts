import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef = new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private _adminService: AdminService,
    private _modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this._adminService.getUsersWithRoles$().subscribe({
      next: (users) => (this.users = users),
    });
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    };
    this.bsModalRef = this._modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (selectedRoles && !this._arrayEqual(selectedRoles, user.roles)) {
          this._adminService
            .updateUserRoles$(user.username, selectedRoles.join(','))
            .subscribe({
              next: (roles) => (user.roles = roles),
            });
        }
      },
    });
  }

  private _arrayEqual(array1: string[], array2: string[]) {
    return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  }
}

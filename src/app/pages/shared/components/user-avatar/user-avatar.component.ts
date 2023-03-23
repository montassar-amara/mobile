import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/user';
import { StoreService } from 'src/app/shared/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Input() isNameHidden = false;
  @Input() isPostPreview = false;
  @Input() fontSize14 = false;
  @Input() user_id: string;
  @Input() user_name: string;
  @Input() user_avatar: string;
  @Input() user_email: string;
  @Input() showOwner = true;
  @Input() loggedInUser!: IUser;
  user: Observable<IUser>;
  filepath = environment.filepath;
  isYou = false;
  constructor() {}
  ngOnInit(): void {
    this.isYou = this.loggedInUser?._id === this.user_id;
  }
}

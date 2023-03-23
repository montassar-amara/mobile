import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-comment-avatar',
  templateUrl: './user-comment-avatar.component.html',
  styleUrls: ['./user-comment-avatar.component.scss'],
})
export class UserCommentAvatarComponent implements OnInit {
  @Input() isLargeSize = false;
  @Input() created_at: string;
  @Input() user_id: string;
  @Input() user_avatar!: string;
  @Input() user_name: string;
  @Input() user_email: string;
  filepath = environment.filepath;
  loggedUser = this.storeService.user$
  isYou = false;
  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loggedUser.subscribe((res) => {
      this.isYou = res?._id === this.user_id;
    });
  }
}

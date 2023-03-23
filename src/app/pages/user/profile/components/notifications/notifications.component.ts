import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  user$ = this.storeService.user$
  notifications$ = this.user$.pipe(map(user=>[
    {name:'Updates',isSMS:user?.update_notif},
    {name:'New Transactions',isSMS:user?.new_transaction_notif},
  ])) 
  subscription$ = this.storeService.subscription$;
  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
  }
  notificationTypeUpdate(index:number){
    this.storeService.updateNotification(index);
  }
}

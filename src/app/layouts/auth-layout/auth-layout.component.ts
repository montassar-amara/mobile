import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit {
  isFirstStep$ = new BehaviorSubject<boolean>(true)
  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.notifier$.pipe(map(notif=>{
      switch (notif) {
        case Notifier.FirstStep:
          this.isFirstStep$.next(true)
          break;
          case Notifier.SecondStep:
            this.isFirstStep$.next(false)
          break;
        default:
          break;
      }
    })).subscribe()
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { BannerService } from 'src/app/shared/styling_services/banner.service';
import { UserProfileService } from 'src/app/shared/styling_services/user-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$ = this.storeService.user$;
  subscription$ = this.storeService.subscription$;
  isOfferClaimed$: Observable<boolean> = this.subscription$.pipe(
    map((res) => res?.type !== 'testing')
  );
  start$ = new BehaviorSubject<boolean>(false);
  constructor(
    private storeService: StoreService,
    public userProfileService: UserProfileService,
    public bannerSevice: BannerService
  ) {}

  ngOnInit(): void {}
  claimOffer() {
    this.start$.next(true);
  }
}

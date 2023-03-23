import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-portfolio-special',
  templateUrl: './portfolio-special.component.html',
  styleUrls: ['./portfolio-special.component.scss']
})
export class PortfolioSpecialComponent implements OnInit {
user$ = this.store.user$;
subs$ = this.store.subscription$
  constructor(private metaInjectorService:MetaInjectorService,private store:StoreService,private router:Router) { }

  ngOnInit(): void {
    this.metaInjectorService.addTag({
      title: 'Portfolio',
      description: 'a study of ',
      ogDescription: 'a study of ',
      ogUrl: 'valpal.io/',
    });
  }
  unlockCompany() {
    if (this.user$.getValue() && !this.subs$.getValue()?.plan?.is_master) {
      this.store.startPlanSubs$.next(true)
    } else {
      this.router.navigate(['auth/login']);
    }
  }
}

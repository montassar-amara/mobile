
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject,  } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  subscription$ = this.storeService.subscription$.asObservable()
  plans$ = this.storeService.plans$
  cards$ = this.storeService.cards$
  defaultCard$ = this.cards$.pipe(map(p=>p.find(r=>r.default)))
  filepath = environment.filepath;
  startSelectPlan$ = new BehaviorSubject<boolean>(false)
  startSelectNewPlan$ = new BehaviorSubject<boolean>(false)
  constructor(
    private storeService: StoreService,private metaInjectorService: MetaInjectorService) {
      this.metaInjectorService.addTag({
        title:'Subscriptions',
        description:'Subscriptions ',
        ogDescription:'Subscriptions ',
        ogUrl:'valpal.io/',
        ogTitle:'Subscriptions'
      })}

  ngOnInit(): void {
    this.storeService.fetchCardList()
  }

  handleAutoPayment() {
    this.storeService.subscriptionAutopaymentPlan()
  }
  unlockNewCompany() {
    // this.router.navigate(['shop']);
    this.storeService.updateNotifier(Notifier.Blink)
  }
  updatePeriod(c: any, p: any) {
    this.storeService.updateCompanyPeriod(c.company_id,p)
  }
  updatePeriodSubscription(period:string){
    this.storeService.updateSubscriptionPeriod(period)
  }
  updateAutopayment(c: any, s: boolean) {
    this.storeService.updateCompanyAutopayment(c.company_id,s)
  }
  trackBy(index: number, name:any): any {
    return name._id;
  }
}

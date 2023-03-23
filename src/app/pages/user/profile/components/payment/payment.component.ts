import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ICard } from 'src/app/shared/models/card';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  cards$ = new BehaviorSubject<ICard[]>([])
  paymentHistory$ = new BehaviorSubject<any[]>([])
  showAddNewCardModal = false
  notifier$ = this.storeService.notifier$
  constructor(
    private subscriptionService: SubscriptionsService,
    private storeService: StoreService,private metaInjectorService: MetaInjectorService) {
      this.metaInjectorService.addTag({
        title:'Payment Method & History',
        description:'Payment Method & History ',
        ogDescription:'Payment Method & History ',
        ogUrl:'valpal.io/',
        ogTitle:'Payment Method & History'
      }) }

  ngOnInit(): void {
    this.notifier$.subscribe((res)=>{
      switch (res) {
        case Notifier.AddCardSuccessful:
          this.showAddNewCardModal=false
          this.subscriptionService.getCardList().pipe(take(1)).subscribe(res=>this.cards$.next(res))
          break;
      
        default:
          break;
      }
    })
    this.subscriptionService.getCardList().pipe(take(1)).subscribe(res=>this.cards$.next(res))
    this.subscriptionService.getPaymentHistory().pipe(take(1)).subscribe(res=>this.paymentHistory$.next(res.reverse()))
  }
  updateCards(){
    this.showAddNewCardModal=false
    this.reloadCards()
  }
  toggleDefault(card:ICard){
    this.subscriptionService.setDefaultCard(card._id).subscribe(()=>this.reloadCards())
  }
  trackBy(index: number, name: ICard): string {
    return name._id;
  }
  deleteCard(card:ICard){
    this.subscriptionService.deleteCard(card).subscribe(()=>this.reloadCards())
  }
  reloadCards(){
    this.subscriptionService.getCardList().subscribe(res=>this.cards$.next(res))
  }
}

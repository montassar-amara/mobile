import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ICard } from 'src/app/shared/models/card';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  cards$ = this.storeService.cards$
  @Output() success = new EventEmitter<ICard | string>();
  @Output() addNew = new EventEmitter();
  @Output() goBack = new EventEmitter();
  @Input() sum!:number
  selectedCard!: ICard;
  destroy$ = new Subject();
  showAddNewCardModal = false;
  errorMsg:string=undefined
  notifier$ = this.storeService.notifier$
  constructor(private storeService: StoreService) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  ngOnInit(): void {
    this.cards$.pipe(takeUntil(this.destroy$)).subscribe((cards) => {
      const tmp = cards.filter((c) => c.default);
      if (tmp.length > 0) {
        this.selectedCard = tmp[0];
      }
    });
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe(notifier=>{
      switch (notifier) {
        case Notifier.AddCardSuccessful:
          this.showAddNewCardModal = false;
          break;
          case Notifier.AddCardFailed:
          // this.showAddNewCardModal = false;
          this.errorMsg = this.storeService.addCardErrorMessage$.getValue()
          break;

        default:
          break;
      }
    })
    this.storeService.fetchCardList()
  }
  onAddNew() {
    this.showAddNewCardModal = true
  }
  payWithCard(btn:HTMLButtonElement) {
    this.success.emit(this.selectedCard);
    btn.disabled = true
  }
  payWithPaypal() {
    this.success.emit('paypal');
  }
  selectCard(card: ICard) {
    this.selectedCard = card;
  }
}

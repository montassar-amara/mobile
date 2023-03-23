import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit,OnDestroy {
  @Input() payingFor!:string
  @Input() companies!:any[]
  @Output() close = new EventEmitter()
  constructor(private storeService:StoreService) { }
  ngOnDestroy(): void {
    this.storeService.updateNotifier(Notifier.NONE)
  }

  ngOnInit(): void {
  }
  closeIt(){
    this.storeService.updateNotifier(Notifier.NONE)
    this.close.emit()
  }
}

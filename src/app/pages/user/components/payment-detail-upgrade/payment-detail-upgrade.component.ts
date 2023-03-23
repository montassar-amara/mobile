import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IPlan } from 'src/app/shared/models/plan';

@Component({
  selector: 'app-payment-detail-upgrade',
  templateUrl: './payment-detail-upgrade.component.html',
  styleUrls: ['./payment-detail-upgrade.component.scss']
})
export class PaymentDetailUpgradeComponent implements OnInit{
  @Input() plan!:IPlan;
  @Input() planPeriod!:string
  @Input() diff!:{
    amount_pay:number;
    new_plan: IPlan;
    old_plan: any;
    price_day:number;
    rest_days:number;
  }
  @Output() confirm = new EventEmitter()
  @Output() back = new EventEmitter()
  constructor(
  ) { }

  ngOnInit(): void {
  }
  onConfirm(){
    this.confirm.
    emit()
  }
  goBack(){
    this.back.emit()
  }
}

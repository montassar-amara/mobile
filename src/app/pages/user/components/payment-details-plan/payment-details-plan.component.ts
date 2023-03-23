import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlan } from 'src/app/shared/models/plan';

@Component({
  selector: 'app-payment-details-plan',
  templateUrl: './payment-details-plan.component.html',
  styleUrls: ['./payment-details-plan.component.scss']
})
export class PaymentDetailsPlanComponent implements OnInit {
  @Input() plan!:IPlan
  @Input() period!:string
  @Output() close = new EventEmitter()
  @Output() back = new EventEmitter();
  @Output() proceed = new EventEmitter()
  price=0
  constructor() { }

  ngOnInit(): void {
    this.price = this.plan.prices.find(p=>p.name_period===this.period).price
  }
}

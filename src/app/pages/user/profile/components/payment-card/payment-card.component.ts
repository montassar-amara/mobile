import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICard } from 'src/app/shared/models/card';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {
  @Input() card!: ICard;
  @Output() toggle = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  toggleDefault() {
    this.toggle.emit(this.card.default);
  }
  removeCard() {
    this.remove.emit();
  }
}

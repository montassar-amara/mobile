import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StoreService } from 'src/app/shared/services/store.service';


@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss'],
})
export class AddNewCardComponent implements OnInit {
  card = this.fb.group({
    card_no: [''],
    dateExpire: [''],
    ccExpiryMonth: [''],
    ccExpiryYear: [''],
    cvcNumber: [''],
    holder_name: [''],
    default: [false],
  });
  errorMsg$ = this.storeService.addCardErrorMessage$
  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {}


  ngOnInit(): void {
    
  }
  saveCard() {
    const dt = this.card.get('dateExpire');
    const date = dt.value.split('/')
    this.storeService.AddCard({...this.card.value,ccExpiryMonth: `${date[0]}`,ccExpiryYear: `${date[1]}`,})
  }

  inputCardNumber(event: any): void {
    const value = event.target.value.replace(/[^\d]/g, '');
    const maxLength = 16;

    let result = '';
    for (let i = 0; i < value.length && i < maxLength; i++) {
      switch (i) {
        case 4:
          result += ' ';
          break;
        case 8:
          result += ' ';
          break;
        case 12:
          result += ' ';
          break;

        default:
          break;
      }

      result += value[i];
    }

    event.target.value = result;
  }

  inputCardExpirationDate(event: any): void {
    let value = event.target.value.replace(/[^\d]/g, '');
    const maxLength = 6;

    if (value.length <= 2) {
      value = value.replace(/^[^01]/g, '0' + value);

      value = value.replace(/1[3456789]/g, '0' + value);
    }

    let result = '';
    for (let i = 0; i < value.length && i < maxLength; i++) {
      switch (i) {
        case 2:
          result += '/';
          break;

        default:
          break;
      }

      result += value[i];
    }

    event.target.value = result;
  }

  inputCardExpirationCvv(event: any): void {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
    if (event.target.value.length > 3) {
      event.target.value = event.target.value.slice(0, 3);
    }
  }
}

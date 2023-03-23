import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';
import { CodeInputModule } from 'angular-code-input';


@NgModule({
  declarations: [
    ConfirmEmailComponent
  ],
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false,
      code: '',
    }),
  ]
})
export class ConfirmEmailModule { }

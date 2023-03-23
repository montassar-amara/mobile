import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetResponseRoutingModule } from './reset-response-routing.module';
import { ResetResponseComponent } from './reset-response.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ResetResponseComponent
  ],
  imports: [
    CommonModule,
    ResetResponseRoutingModule,
    PasswordStrengthMeterModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class ResetResponseModule { }

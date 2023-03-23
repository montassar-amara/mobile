import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {MatListModule} from '@angular/material/list';
import { SettingsComponent } from './components/settings/settings.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ThemeComponent } from './components/theme/theme.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import {DialogModule} from 'primeng/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import {MatInputModule} from '@angular/material/input';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../../shared/shared.module';
import { PaymentsModule } from '../components/payments.module';

@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
    SubscriptionsComponent,
    PaymentComponent,
    ThemeComponent,
    NotificationsComponent,
    ChangeEmailComponent,
    PaymentCardComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatListModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CodeInputModule,
    MatInputModule,
    AllPipesModule,
    ImageCropperModule,
    SharedModule,
    PaymentsModule,
  ]
})
export class ProfileModule { }

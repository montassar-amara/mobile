import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { ThemeComponent } from './components/theme/theme.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent,children:[
    { path: 'settings', component: SettingsComponent},
    { path: 'subscriptions', component: SubscriptionsComponent},
    { path: 'payment', component: PaymentComponent},
    { path: 'preference', component: ThemeComponent},
    { path: 'notifications', component: NotificationsComponent},
    { path: '', redirectTo:'settings',pathMatch:'full'},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

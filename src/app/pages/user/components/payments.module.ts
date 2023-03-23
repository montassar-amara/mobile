import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewCardComponent } from './add-new-card/add-new-card.component';
import { CompanyListItemComponent } from './company-list-item/company-list-item.component';
import { PaymentDetailUpgradeComponent } from './payment-detail-upgrade/payment-detail-upgrade.component';
import { PaymentDetailsPlanComponent } from './payment-details-plan/payment-details-plan.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { SelectCompanyScenarioComponent } from './select-company-scenario/select-company-scenario.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { SelectPlanScenarioComponent } from './select-plan-scenario/select-plan-scenario.component';
import { SharedModule } from '../../shared/shared.module';
import { SelectNewPlanScenarioComponent } from './select-new-plan-scenario/select-new-plan-scenario.component';
import { SelectNewPlanComponent } from './select-new-plan/select-new-plan.component';



@NgModule({
  declarations: [
    AddNewCardComponent,
    CompanyListItemComponent,
    PaymentDetailUpgradeComponent,
    PaymentDetailsPlanComponent,
    PaymentMethodComponent,
    PaymentSuccessComponent,
    SelectCompanyScenarioComponent,
    SelectPlanComponent,
    SelectPlanScenarioComponent,
    SelectNewPlanScenarioComponent,
    SelectNewPlanComponent,

  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    AddNewCardComponent,
    CompanyListItemComponent,
    PaymentDetailUpgradeComponent,
    PaymentDetailsPlanComponent,
    PaymentMethodComponent,
    PaymentSuccessComponent,
    SelectCompanyScenarioComponent,
    SelectPlanComponent,
    SelectPlanScenarioComponent,
    SelectNewPlanScenarioComponent,
    SelectNewPlanComponent
  ]
})
export class PaymentsModule { }

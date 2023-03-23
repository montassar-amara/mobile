import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuationWidgetRoutingModule } from './valuation-widget-routing.module';
import { ValuationWidgetComponent } from './valuation-widget.component';


@NgModule({
  declarations: [
    ValuationWidgetComponent
  ],
  imports: [
    CommonModule,
    ValuationWidgetRoutingModule
  ]
})
export class ValuationWidgetModule { }

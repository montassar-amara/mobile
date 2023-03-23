import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValuationWidgetComponent } from './valuation-widget.component';

const routes: Routes = [{ path: '', component: ValuationWidgetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuationWidgetRoutingModule { }

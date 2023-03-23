import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricalWidgetComponent } from './historical-widget.component';

const routes: Routes = [{ path: '', component: HistoricalWidgetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricalWidgetRoutingModule { }

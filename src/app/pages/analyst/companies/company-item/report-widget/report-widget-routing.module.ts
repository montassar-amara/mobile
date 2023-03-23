import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditReportWidgetComponent } from './edit-report-widget/edit-report-widget.component';
import {CreateReportWidgetComponent} from "./create-report-widget/create-report-widget.component";

const routes: Routes = [
    { path: 'create/:company_id', component: CreateReportWidgetComponent },
    { path: ':id', component: EditReportWidgetComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportWidgetRoutingModule { }

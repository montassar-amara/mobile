import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalystLayoutComponent } from 'src/app/layouts/analyst-layout/analyst-layout.component';

const routes: Routes = [
  
  {
    path: 'report',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./companies/company-item/report-widget/report-widget.module').then(m => m.ReportWidgetModule) }
    ]
  },
  
  {
    path: 'overview',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule) }
    ]
  },
  {
    path: 'companies',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) }
    ]
  },
  {
    path: 'requests',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule) }
    ]
  },
  
  {
    path: 'historical/:id',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./companies/company-item/historical-widget/historical-widget.module').then(m => m.HistoricalWidgetModule) }
    ]
  },
  {
    path: 'valuation/:id',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./companies/company-item/valuation-widget/valuation-widget.module').then(m => m.ValuationWidgetModule) }
    ]
  },
  {
    path: '',
    component: AnalystLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalystRoutingModule { }

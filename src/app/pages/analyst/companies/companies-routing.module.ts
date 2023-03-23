import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalystLayoutComponent } from 'src/app/layouts/analyst-layout/analyst-layout.component';
import { CompaniesComponent } from './companies.component';

const routes: Routes = [
  { path: '',
    component: CompaniesComponent
  },
  {
    path: ':id',
    loadChildren: () => import('./company-item/company-item.module').then(m => m.CompanyItemModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }

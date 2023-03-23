import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyItemComponent } from './company-item.component';

const routes: Routes = [{ path: '', component: CompanyItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyItemRoutingModule { }

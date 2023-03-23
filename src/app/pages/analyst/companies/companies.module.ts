import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
// import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';


@NgModule({
  declarations: [
    CompaniesComponent,
    AddNewCompanyComponent,
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    ReactiveFormsModule,
    // SpreadSheetsModule,
    FormsModule,
  ]
})
export class CompaniesModule { }

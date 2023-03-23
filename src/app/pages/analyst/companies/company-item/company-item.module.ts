import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyItemRoutingModule } from './company-item-routing.module';
import { CompanyItemComponent } from './company-item.component';

import {DialogModule} from "primeng/dialog";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CompanyItemComponent
  ],
  imports: [
    CommonModule,
    CompanyItemRoutingModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CompanyItemModule { }

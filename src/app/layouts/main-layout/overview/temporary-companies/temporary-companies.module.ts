import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemporaryCompaniesComponent } from './temporary-companies.component';
import { DragDropModule } from 'primeng/dragdrop';
import { ImageModule } from 'primeng/image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { CompaniesListModule } from '../../companies-list/company-list.module';

@NgModule({
  declarations: [
    TemporaryCompaniesComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ImageModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleButtonModule,
    CompaniesListModule
  ],
  exports:[
    TemporaryCompaniesComponent
  ]
})
export class TemporaryCompaniesModule { }

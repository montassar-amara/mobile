import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesListComponent } from './companies-list.component';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    CompaniesListComponent,
  ],
  imports: [
    CommonModule,
    AllPipesModule,
    TooltipModule
  ],
  exports:[
    CompaniesListComponent
  ]
})
export class CompaniesListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalystRoutingModule } from './analyst-routing.module';
import { AnalystComponent } from './analyst.component';
import { AnalystHeaderComponent } from 'src/app/layouts/analyst-header/analyst-header.component';
import { AnalystLayoutComponent } from 'src/app/layouts/analyst-layout/analyst-layout.component';


@NgModule({
  declarations: [
    AnalystComponent,
    AnalystHeaderComponent,
    AnalystLayoutComponent,
  ],
  imports: [
    CommonModule,
    AnalystRoutingModule,
  ]
})
export class AnalystModule { }

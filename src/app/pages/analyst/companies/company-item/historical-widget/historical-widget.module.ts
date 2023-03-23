import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricalWidgetRoutingModule } from './historical-widget-routing.module';
import { HistoricalWidgetComponent } from './historical-widget.component';
// import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';
import { CurrentFileComponent } from './current-file/current-file.component';

@NgModule({
  declarations: [
    HistoricalWidgetComponent,
    CurrentFileComponent
  ],
  imports: [
    CommonModule,
    HistoricalWidgetRoutingModule,
    // SpreadSheetsModule
  ]
})
export class HistoricalWidgetModule { }

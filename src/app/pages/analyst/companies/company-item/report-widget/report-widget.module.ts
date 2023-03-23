import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportWidgetRoutingModule } from './report-widget-routing.module';
import {CreateReportWidgetComponent} from "./create-report-widget/create-report-widget.component";
import { EditReportWidgetComponent } from './edit-report-widget/edit-report-widget.component';
import {FormsModule} from "@angular/forms";

import {NgxWigModule} from 'ngx-wig';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DropdownModule} from "primeng/dropdown";
import {MatGridListModule} from "@angular/material/grid-list";
import {DialogModule} from "primeng/dialog";
import {ImageCropperModule} from "ngx-image-cropper";


@NgModule({
  declarations: [
    CreateReportWidgetComponent,
    EditReportWidgetComponent
  ],
  imports: [
    CommonModule,
    ReportWidgetRoutingModule,
    FormsModule,
    NgxWigModule,
    NgbModule,
    DragDropModule,
    DropdownModule,
    MatGridListModule,
    DialogModule,
    ImageCropperModule
  ]
})
export class ReportWidgetModule { }

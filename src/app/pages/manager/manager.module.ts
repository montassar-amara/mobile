import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ManagerHeaderComponent } from 'src/app/layouts/manager-header/manager-header.component';
import { ManagerLayoutComponent } from 'src/app/layouts/manager-layout/manager-layout.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TemporaryCompaniesModule } from 'src/app/layouts/main-layout/overview/temporary-companies/temporary-companies.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import { SharedModule } from '../../pages/shared/shared.module';


@NgModule({
  declarations: [
    ManagerComponent,
    ManagerHeaderComponent,
    ManagerLayoutComponent,
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    ScrollPanelModule,
    TemporaryCompaniesModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    AllPipesModule,
    ImageCropperModule,
    SharedModule
  ]
})
export class ManagerModule { }

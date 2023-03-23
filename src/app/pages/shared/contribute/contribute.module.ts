import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarModule } from 'primeng/avatar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { ContributeComponent } from './contribute.component';
import { SharedModule } from '../shared.module';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import {ChartModule} from 'primeng/chart';
@NgModule({
  declarations: [
    ContributeComponent,
  ],
  imports: [
    CommonModule,
    AvatarModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    SidebarModule,
    AllPipesModule,
    ChartModule,
  ],
  exports: [ContributeComponent],
})
export class ContributeModule {}

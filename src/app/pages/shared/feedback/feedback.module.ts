import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { SharedModule } from '../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
@NgModule({
  declarations: [
    FeedbackComponent,
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
  ],
  exports: [FeedbackComponent],
})
export class FeedbackModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeforeLastPipe } from './before-last.pipe';
import { DateSincePipe } from './date-since.pipe';
import { ExpiredPipe } from './expired.pipe';
import { IncludesPipe } from './includes.pipe';
import { IsImagePipe } from './is-image.pipe';
import { LastPipe } from './last.pipe';
import { MonthlyPipe } from './monthly.pipe';
import { MycompanyPipe } from './mycompany.pipe';
import { NotifTitlePipe } from './notif-title.pipe';
import { PlanStatusPipe } from './plan-status.pipe';
import { PreviewUploadPipe } from './preview-upload.pipe';
import { PricesPipe } from './prices.pipe';
import { SavingPipe } from './saving.pipe';
import { SelectPricePipe } from './select-price.pipe';
import { UnderscorePipe } from './underscore.pipe';
import { IsLockedPipe } from './is-locked.pipe';
import { HighlightSearchPipe } from 'src/app/pipes/highlight-search.pipe';



@NgModule({
  declarations: [
    BeforeLastPipe,
    DateSincePipe,
    ExpiredPipe,
    IncludesPipe,
    IsImagePipe,
    LastPipe,
    MonthlyPipe,
    MycompanyPipe,
    NotifTitlePipe,
    PlanStatusPipe,
    PreviewUploadPipe,
    PricesPipe,
    SavingPipe,
    SelectPricePipe,
    UnderscorePipe,
    IsLockedPipe,
    HighlightSearchPipe,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    BeforeLastPipe,
    DateSincePipe,
    ExpiredPipe,
    IncludesPipe,
    IsImagePipe,
    LastPipe,
    MonthlyPipe,
    MycompanyPipe,
    NotifTitlePipe,
    PlanStatusPipe,
    PreviewUploadPipe,
    PricesPipe,
    SavingPipe,
    SelectPricePipe,
    UnderscorePipe,
    IsLockedPipe,
    HighlightSearchPipe
  ]
})
export class AllPipesModule { }

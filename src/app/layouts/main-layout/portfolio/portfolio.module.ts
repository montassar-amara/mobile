import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';
import {ChartModule} from 'primeng/chart';
import {BadgeModule} from 'primeng/badge';
import {SelectButtonModule} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import {DialogModule} from 'primeng/dialog';
import { BlogListComponent } from 'src/app/pages/shared/blog/blog-list/blog-list.component';
import { PortfolioSpecialComponent } from '../portfolio-special/portfolio-special.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    BlogListComponent,
    PortfolioSpecialComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    ChartModule,
    BadgeModule,
    SelectButtonModule,
    FormsModule,
    YouTubePlayerModule,
    DialogModule
  ]
})
export class PortfolioModule { }

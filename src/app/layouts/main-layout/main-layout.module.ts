import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { FaqsComponent } from './faqs/faqs.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { MainLayoutComponent } from './main-layout.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { ElevationDirective } from '../../directives/elevation.directive';
import { MatGridListModule } from '@angular/material/grid-list';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { TemporaryCompaniesModule } from './overview/temporary-companies/temporary-companies.module';
import { OverviewComponent } from './overview/overview.component';
import { ContributeModule } from 'src/app/pages/shared/contribute/contribute.module';
import { SidebarModule } from 'primeng/sidebar';
import { FeedbackModule } from 'src/app/pages/shared/feedback/feedback.module';
import {
  NgbCarouselModule,
  NgbCollapseModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyPreviewComponent } from './company-preview/company-preview.component';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { RatingBgDarkModeColorPipe } from 'src/app/pipes/rating-bg-dark-mode-color.pipe';
import { RatingBgLightModeColorPipe } from 'src/app/pipes/rating-bg-light-mode-color.pipe';
import { RatingTextDarkModeColorPipe } from 'src/app/pipes/rating-text-dark-mode-color.pipe';
import { RatingTextLightModeColorPipe } from 'src/app/pipes/rating-text-light-mode-color.pipe';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import { SectorOverviewComponent } from './overview/sector-overview/sector-overview.component';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentsModule } from 'src/app/pages/user/components/payments.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NewOverviewComponent } from './new-overview/new-overview.component';
import {TabViewModule} from 'primeng/tabview';
import {CarouselModule} from 'primeng/carousel';
import { CompaniesListModule } from './companies-list/company-list.module';
@NgModule({
  declarations: [
    AboutUsComponent,
    ContactComponent,
    FaqsComponent,
    HowitworksComponent,
    MainLayoutComponent,
    ElevationDirective,
    OverviewComponent,
    CompanyPreviewComponent,
    RatingBgDarkModeColorPipe,
    RatingBgLightModeColorPipe,
    RatingTextDarkModeColorPipe,
    RatingTextLightModeColorPipe,
    SectorOverviewComponent,
    NewOverviewComponent,
  ],
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
    MatGridListModule,
    DialogModule,
    DragDropModule,
    TemporaryCompaniesModule,
    ContributeModule,
    SidebarModule,
    FeedbackModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbCollapseModule,
    AllPipesModule,
    TooltipModule,
    PaymentsModule,
    NgxSkeletonLoaderModule,
    TabViewModule,
    CarouselModule,
    CompaniesListModule,
  ],
})
export class MainLayoutModule {}

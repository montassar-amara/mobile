import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from 'src/app/pages/shared/blog/preview/preview.component';
import { ProfileModule } from 'src/app/pages/user/profile/profile.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { CompanyPreviewComponent } from './company-preview/company-preview.component';
import { ContactComponent } from './contact/contact.component';
import { FaqsComponent } from './faqs/faqs.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { MainLayoutComponent } from './main-layout.component';
import { NewOverviewComponent } from './new-overview/new-overview.component';

const routes: Routes = [
  
  {
    path: 'reset-password-request',
    loadChildren: () =>
    import('../../public/reset-request/reset-request.module').then(
      (m) => m.ResetRequestModule
      ),
    },
    {
      path: 'reset-password-response',
      loadChildren: () =>
      import('../../public/reset-response/reset-response.module').then(
        (m) => m.ResetResponseModule
        ),
      },
      {
        path: 'confirm-email',
        loadChildren: () =>
        import('../../public/confirm-email/confirm-email.module').then(
          (m) => m.ConfirmEmailModule
          ),
        },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path:'overview',component:NewOverviewComponent},
      // {path:'newoverview',component:NewOverviewComponent},
      { path: 'contact', component: ContactComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'aboutus', component: AboutUsComponent },
      { path: 'howitworks', component: HowitworksComponent },
      { path: 'portfolio', loadChildren:()=> import('./portfolio/portfolio.module').then(m=>m.PortfolioModule) },

      {path:'',pathMatch:'full',redirectTo:'overview'},
      {
        path: '',
        loadChildren: () => ProfileModule,
        // canActivate: [AuthGuard],
      },
      {
         path:'blog/:date/:title',
         component: PreviewComponent,
      },
      
      {path:':name',component:CompanyPreviewComponent},
]
},


 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from 'src/app/public/login/login.module';
import { RegisterModule } from 'src/app/public/register/register.module';
import { AuthLayoutComponent } from './auth-layout.component';

const routes: Routes = [
  {
    path:'',
    component:AuthLayoutComponent,
    children:[
      {
        path:'login',
        loadChildren:()=>LoginModule
      },
      {
        path:'register',
        loadChildren:()=>RegisterModule
      },
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
        loadChildren: () =>import('../../public/confirm-email/confirm-email.module').then((m) => m.ConfirmEmailModule),
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule { }

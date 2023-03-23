import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerLayoutComponent } from 'src/app/layouts/manager-layout/manager-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerLayoutComponent
  },
  {
    path: 'blogs',
    component: ManagerLayoutComponent,
    children: [
      { path: '', loadChildren:()=>import('../../pages/shared/blog/blog.module').then(m=>m.BlogModule)},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }

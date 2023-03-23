import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './public/blank/blank.component';
import { OnmobileGuard } from './shared/guards/onmobile.guard';

const routes: Routes = [
  { path: 'blank', component: BlankComponent },
  {
    path: 'analyst',
    canActivate: [OnmobileGuard],
    loadChildren: () =>
      import('./pages/analyst/analyst.module').then((m) => m.AnalystModule),
  },
  {
    path: 'manager',
    canActivate: [OnmobileGuard],
    loadChildren: () =>
      import('./pages/manager/manager.module').then((m) => m.ManagerModule),
  },
  {
    path: 'auth',
    canActivate: [OnmobileGuard],
    loadChildren: () =>
      import('./layouts/auth-layout/auth-layout.module').then(
        (m) => m.AuthLayoutModule
      ),
  },
  {
    path: '',
    canActivate: [OnmobileGuard],
    loadChildren: () =>
      import('./layouts/main-layout/main-layout.module').then(
        (m) => m.MainLayoutModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

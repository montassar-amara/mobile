import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxWigModule } from 'ngx-wig';
import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { authInterceptorProviders } from './_Helpers/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserProfileService } from './shared/styling_services/user-profile.service';
import { FeedbackAreaService } from './shared/styling_services/feedback-area.service';
import { SmallResolutionScreenComponent } from './layouts/small-resolution-screen/small-resolution-screen.component';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { BlankComponent } from './public/blank/blank.component';
@NgModule({
  declarations: [
    AppComponent,
    SmallResolutionScreenComponent,
    BlankComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxWigModule,
    ScrollPanelModule,
    DialogModule,
  ],
  providers: [
    authInterceptorProviders,
    UserProfileService,
    FeedbackAreaService,
    Meta,
    Title,
    // { provide: RouteReuseStrategy, useClass: MyCustomRouteReuseStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '349104359604-n9a42rh0lnmas2pceql2774s19nd3c7o.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {},
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

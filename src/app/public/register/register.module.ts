import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { RegisterComponent } from './register.component';
import { CodeInputModule } from 'angular-code-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';


@NgModule({
  declarations: [
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    SocialLoginModule,
    DialogModule,
    SharedModule,
    AllPipesModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false,
      code: '',
    }),
  ]
})
export class RegisterModule { }

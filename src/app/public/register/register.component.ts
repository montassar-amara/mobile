import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import intlTelInput from 'intl-tel-input';
import { BehaviorSubject, combineLatest, lastValueFrom, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Notifier } from 'src/app/shared/store/states';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../shared/services/authentication/token-storage.service';
import { AuthStatusService } from '../../shared/services/authentication/auth-status.service';
import { ICompany } from 'src/app/shared/models/company';
import { environment } from 'src/environments/environment';
import { EmailService } from 'src/app/shared/services/email.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SeePlansService } from 'src/app/shared/styling_services/see-plans.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('investorType') investorType: TemplateRef<any>;
  @ViewChild('registration') registration: TemplateRef<any>;
  @ViewChild('phoneNumber') phoneNumber: TemplateRef<any>;
  @ViewChild('confirmPhone') confirmPhone: TemplateRef<any>;
  @ViewChild('confirmEmail') confirmEmail: TemplateRef<any>;
  @ViewChild('institutionalForm') institutionalForm: TemplateRef<any>;
  @ViewChild('createPassword') createPassword: TemplateRef<any>;
  @ViewChild('almostdone') almostdone: TemplateRef<any>;
  @ViewChild('termOfuse') termOfuse: TemplateRef<any>;
  @ViewChild('privacyPolicy') privacyPolicy: TemplateRef<any>;
  @ViewChild('randomCompany') randomCompany: TemplateRef<any>;
  // @ViewChild('welcome') welcome: TemplateRef<any>;
  institutionalModal = false;
  errorMsg = '';
  loginType: 'email' | 'social' = 'email';
  viewStack$ = new BehaviorSubject<TemplateRef<any>[]>([]);
  invTypes = ['Retail', 'Institutional'];
  destroy$ = new Subject<any>();
  emailExist = false;
  notifier$ = this.storeService.notifier$
  registerData = {
    investorType: '',
    phoneCode:'',
    email: '',
    code: '',
    name: '',
    found: '',
    notifBySMS: false,
    notifByEmail: true,
    phone:undefined,
    confirmPassword: '',
    agreeToTerms: false,
    phoneVerifCode:undefined,
    agreeToPrivacy: false,
    password: '',
    institution: {
      companyType: '1',
      companyName: '',
      email: '',
      phone: '',
    },
  };
  showEmailSent = false;
  showLoading = false;
  codeNotCorrect = false;
  codeNotCorrectSMS = '';
  notify_by_phone
  startTimer: boolean = false;
  display: any;
  companies$ = this.storeService.companies$
  pickRandom$ = new Subject<boolean>();
  randomCompany$ = new BehaviorSubject<ICompany>(undefined);
  socialUser: SocialUser = null;
  filepath = environment.filepath;
  canReroll = true;
  start$ = new BehaviorSubject<boolean>(false);
  canGoBack = true;
  welcomeVerifyData = {
    email: false,
    sms: true,
  };
  phone_number = ''
  phone_code = ''
  isVisiblePassword: boolean = false;
  passwordType: 'password' | 'text' = 'password';

  constructor(
    private storeService: StoreService,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private Auth: AuthStatusService,
    private route: Router,
    private emailService: EmailService,
    private userService: UserService,
    public seePlansPopup: SeePlansService,
    private metaInjectorService: MetaInjectorService) {
      this.metaInjectorService.addTag({
        title:'Register',
        description:'Register ',
        ogDescription:'Register ',
        ogUrl:'valpal.io/',
        ogTitle:'Register'
      })}
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewStack$.next([this.investorType]);
    });
  }
  ngOnInit(): void {
    combineLatest([
      this.companies$.pipe(
        distinctUntilChanged((a, b) => a.length === b.length)
      ),
      this.pickRandom$,
    ])
      .pipe(
        map(([companies, rnd]) => {
          const cmp = this.randomCompany$.getValue();
          const cmps =  companies.filter(c=>!c.is_free && !c.process && c.listed)
          let pick =cmps[Math.floor(Math.random() * cmps.length)];
          while (pick === cmp) {
            pick = cmps[Math.floor(Math.random() * cmps.length)];
          }
          this.randomCompany$.next(pick);
          this.storeService.subscriptionFreeCompany(pick._id)
        })
      )
      .subscribe();
    this.storeService.fetchCompanies()
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe((notif) => {
      switch (notif) {
        case Notifier.verifyEmailSuccessfullExist:
          this.emailExist = true;
          break;
        case Notifier.verifyEmailSuccessfullNotExist:
          this.emailExist = false;
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.confirmEmail,
          ]);
          break;
        case Notifier.resendCodeSuccessful:
          this.showEmailSent = true;
          this.showLoading = false;
          this.timer(1);
          break;
          case Notifier.PhoneCodeSuccessful:
            this.showEmailSent = true;
            this.showLoading = false;
            this.timer(1);
            break;
        case Notifier.verifyCodeSuccessful:
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.createPassword,
          ]);
          break;
          case Notifier.VerifyPhoneNumberExistSuccessful:
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.confirmPhone,
          ]);
          break;
          case Notifier.VerifyPhoneNumberExistFail:
          this.codeNotCorrect = true;
          break;
          case Notifier.VerifyPhoneCodeSuccessful:
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.almostdone,
          ]);
          break;
          case Notifier.VerifyPhoneCodeFail:
            this.codeNotCorrect = true;
          break;
        case Notifier.verifyCodeFail:
          this.codeNotCorrect = true;
          break;
        case Notifier.socialLoginSuccessful:
          this.codeNotCorrect = true;
          break;
        case Notifier.SubscriptionFreeCompanySuccessful:
          this.codeNotCorrect = true;
          break;
        default:
          break;
      }
    });

    this.socialAuthService.authState.subscribe(async (user) => {
      this.socialUser = user;
      if (user != null && window.location.href.includes('register')) {
        this.registerData.name = user.name;
        const notExists = await lastValueFrom(
          this.authService.verifEmail(user.email)
        );
        if (notExists) {
          this.setupphoneInput()
          this.errorMsg = ''
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.phoneNumber,
          ]);
        } else {
          this.emailExist = true;
        }

        // this.register(this.socialUser.name, this.socialUser.email, this.socialUser.email, this.socialUser.email, 'google');
      }
    });
  }

  isSafari(): boolean {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  isiOS(): boolean {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform);
  }

  investorTypeSelected() {
    this.storeService.updateNotifier(Notifier.SecondStep)
    if (this.registerData.investorType === 'Retail') {
      this.viewStack$.next([...this.viewStack$.getValue(), this.registration]);
    } else if (this.registerData.investorType === 'Institutional') {
      this.viewStack$.next([
        ...this.viewStack$.getValue(),
        this.institutionalForm,
      ]);
      setTimeout(() => {
        const input = document.querySelector('#mobileCode');
        intlTelInput(input, {
          autoHideDialCode: false,
          separateDialCode: true,
          // any initialisation options go here
        });

        const intlWidth = $('div.iti.iti--allow-dropdown').width();
        $('div.iti.iti--allow-dropdown ul.iti__country-list').width(
          intlWidth - 2
        );
      }, 100);
    }
  }
  emailEntred() {
    this.storeService.verifyEmail(this.registerData.email.toLocaleLowerCase())
  }
  emailConfirmed(code: string) {
    this.registerData.code = code;
    this.storeService.verifyCode(this.registerData.email, code)
  }
  
  previous() {
    const views = this.viewStack$.getValue();
    views.pop();
    if(views.length===1){
      this.storeService.updateNotifier(Notifier.FirstStep)
    }
    this.viewStack$.next([...views]);
  }
  almostDone() {
    this.viewStack$.next([...this.viewStack$.getValue(), this.termOfuse]);
  }
  companyData() {
    const form = new FormData();
    const phone_code = $('div.iti__selected-dial-code').html() ?? '';
    const phone_number = $('#mobileCode').val() ?? '';
    form.append(
      'company_type',
      this.registerData.institution.companyType === '4'
        ? (phone_number as string)
        : this.registerData.institution.companyType
    );
    form.append('company_name', this.registerData.institution.companyName);
    form.append('email', this.registerData.institution.email);
    form.append('phone', `${phone_code}${phone_number}`);
    this.emailService.businessAdd(form).subscribe(() => {
      this.institutionalModal = true;
      this.registerData.institution.companyType = '';
      this.registerData.institution.companyName = '';
      this.registerData.institution.email = '';
      this.registerData.institution.phone = '';
    });
  }
  createPasswords() {
    this.setupphoneInput()
    this.errorMsg = ''
    this.viewStack$.next([...this.viewStack$.getValue(), this.phoneNumber]);
  }
  setupphoneInput(){
    setTimeout(() => {
      const input = document.querySelector('#mobileCode2');
      intlTelInput(input, {
        autoHideDialCode: false,
        separateDialCode: true,
        // any initialisation options go here
      });

      const intlWidth = $('div.iti.iti--allow-dropdown').width();
      $('div.iti.iti--allow-dropdown ul.iti__country-list').width(
        intlWidth - 2
      );
    }, 100);
  }
  termsOfUse() {
    this.viewStack$.next([...this.viewStack$.getValue(), this.privacyPolicy]);
  }
  privacyPolicyAgree() {
    if (this.socialUser) {
      this.register(
        this.socialUser.name,
        this.socialUser.email,
        this.socialUser.email,
        this.socialUser.email,
        'google'
      );
    } else {
      this.register(
        this.registerData.name,
        this.registerData.email,
        this.registerData.password,
        this.registerData.confirmPassword,
        'email'
      );
    }
  }
  pickedRandomCompany() {
    // this.viewStack$.next([...this.viewStack$.getValue(), this.welcome]);

    // setTimeout(() => {
    //   // const input = document.querySelector('#phoneNumber2');
    //   // intlTelInput(input, {
    //   //   autoHideDialCode: false,
    //   //   separateDialCode: true,
    //   //   // any initialisation options go here
    //   // });
    //   const intlWidth = $(
    //     '.welcome-verify div.iti.iti--allow-dropdown'
    //   ).width();
    //   $(
    //     '.welcome-verify div.iti.iti--allow-dropdown ul.iti__country-list'
    //   ).width(intlWidth - 12);
    // }, 100);
    this.skip()
  }
  socialLoginGoogle() {
    this.viewStack$.next([...this.viewStack$.getValue(), this.almostdone]);
  }
  async onGoogleSignUp(): Promise<void> {
    // const btnGSign = $(
    //   'asl-google-signin-button div[aria-labelledby="button-label"]'
    // );
    // $(btnGSign).trigger('click');
    const user:any = await GoogleAuth.signIn()
    this.socialUser = user;
      if (user != null && window.location.href.includes('register')) {
        this.registerData.name = user.name;
        const notExists = await lastValueFrom(
          this.authService.verifEmail(user.email)
        );
        if (notExists) {
          this.setupphoneInput()
          this.errorMsg = ''
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.phoneNumber,
          ]);
        } else {
          this.emailExist = true;
        }

        // this.register(this.socialUser.name, this.socialUser.email, this.socialUser.email, this.socialUser.email, 'google');
      }
  }
  resendVerifCode() {
    this.storeService.resendCode(this.registerData.email)
    this.showLoading = true;
    this.showEmailSent = false;
  }
 
  timer(minute: number) {
    // let minute = 1;
    this.startTimer = true;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.startTimer = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  register(
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    auth_provider: string
  ): void {
    this.authService
      .register(username, email, password, password_confirmation, auth_provider)
      .subscribe({
        next: (data) => {
          this.handleRegisterResponse(data);
          this.viewStack$.next([
            ...this.viewStack$.getValue(),
            this.randomCompany,
          ]);
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  handleRegisterResponse(data: any): void {
    if (this.socialUser == null) {
      this.signInEmail();
    } else {
      // social sign up
      this.signInSocial();
    }
  }

  handleError(error: any): void {
    if (error !== null) {
    }
  }

  signInSocial(): void {
    if (this.socialUser != null) {
      const email = this.socialUser.email;
      const password = this.socialUser.email;
      const auth_provider = 'google';
      // this.store.dispatch(socialLogin({email,password,provider:auth_provider}))
      this.authService.signin(email, password, auth_provider).subscribe(
        (data) => {
          this.tokenStorage.saveToken(data.access_token);
          this.tokenStorage.saveRefreshToken(data.refresh_token);
          this.tokenStorage.saveUser(data);
          this.tokenStorage.saveUserId(data.user._id);

          this.Auth.changeAuthStatus(true);
          this.storeService.fetchUser()
          this.pickRandom$.next(true);
          this.canGoBack = false;
          // setTimeout(() => {
          //   this.router.navigateByUrl('/');
          // }, 200);
        },
        (error) => {}
      );
    }
  }
  signInEmail(): void {
    const email = this.registerData.email;
    const password = this.registerData.password;
    const auth_provider = 'email';
    // this.store.dispatch(socialLogin({email,password,provider:auth_provider}))
    this.authService
      .signin(email, password, auth_provider)
      .subscribe((data) => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveRefreshToken(data.refresh_token);
        this.tokenStorage.saveUser(data);
        this.tokenStorage.saveUserId(data.user._id);

        this.Auth.changeAuthStatus(true);
        this.storeService.fetchUser()
        this.pickRandom$.next(true);
      });
  }
  reroll() {
    this.canReroll = false;
    this.pickRandom$.next(true);
  }
  updateNotif() {
    const { found, notifByEmail, notifBySMS } = this.registerData;
    const phone_code = this.phone_code
    const phone_number = this.phone_number
    this.userService
      .updateNotification(
        found,
        notifBySMS,
        notifByEmail,
        phone_code,
        phone_number
      )
      .subscribe();
  }
  claimOffer() {
    this.start$.next(true);
    this.updateNotif();
  }
  skip() {
    this.updateNotif();
    if (this.loginType === 'email') {
      this.signInEmail();
    } else {
      this.signInSocial();
    }
    this.route.navigate(['overview']);
  }
  readMoreTerms() {
    this.storeService.updateNotifier(Notifier.ShowTermsModal)
  }
  readMorePrivacy() {
    this.storeService.updateNotifier(Notifier.ShowPrivacyModal)
  }
  notifyBysms(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      setTimeout(() => {
        const input = document.querySelector('#smsNotif');
        intlTelInput(input, {
          autoHideDialCode: false,
          separateDialCode: true,
          // any initialisation options go here
        });

        const intlWidth = $('div.iti.iti--allow-dropdown').width();
        $('div.iti.iti--allow-dropdown ul.iti__country-list').width(
          intlWidth - 2
        );
      }, 100);
    }
  }

  showHidePassword(): void {
    this.isVisiblePassword = !this.isVisiblePassword;
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  seePlans() {
    this.seePlansPopup.isFromRegisterStep = true;
    if (window.innerWidth >= 768) {
      this.seePlansPopup.showSeeOurPlansModal = true;
    } else {
      this.route.navigateByUrl('/see-our-plans');
    }
  }
  phoneEntred(){
    this.phone_code = $('div.iti__selected-dial-code').html() ?? '';
    this.phone_number = ($('#mobileCode2').val() ?? '')+'';
    this.registerData.phoneCode = this.phone_code+this.phone_number;

    this.userService.verifyUniquePhone(this.phone_code,this.phone_number).subscribe(res=>{
      if(!res){
        const frame = document.getElementById('myIframe') as HTMLIFrameElement;
      frame.contentWindow.postMessage({type:'sendOtp',phone:this.registerData.phoneCode},'*')
      const next = ()=> this.viewStack$.next([
        ...this.viewStack$.getValue(),
        this.confirmPhone,
      ]);
      const final = ()=>this.viewStack$.next([
        ...this.viewStack$.getValue(),
        this.almostdone,
      ]);
      const error = (msg:string)=>{
        this.codeNotCorrectSMS = msg;
      }
      const error1 = (msg:string)=>{
        this.errorMsg = msg;
      }
      window.onmessage = function(e) {
        if(e.data.type==='otpcheck'){
          if(e.data.result){
            final()
          }else{
            error(e.data.msg)
          }
        }
        if(e.data.type==='otpstart'){
          if(e.data.result){
            next()
          }else{
            error1(e.data.msg)
          }
        }
    };
      }else{
        this.errorMsg = 'This number is used by another account.'
      }
    })
   
  }
  phoneConfirmed(code: string) {
    this.registerData.phoneVerifCode = code;
    const frame = document.getElementById('myIframe') as HTMLIFrameElement;
    frame.contentWindow.postMessage({type:'checkOtp',phone:this.registerData.phoneCode,code},'*')
  }
  resendVerifCodePhone(){
    this.showEmailSent = true;
    this.showLoading = false;
    this.codeNotCorrectSMS = '';
    const frame = document.getElementById('myIframe') as HTMLIFrameElement;
    frame.contentWindow.postMessage({type:'sendOtp',phone:this.registerData.phoneCode},'*')
    this.timer(10);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStatusService } from 'src/app/shared/services/authentication/auth-status.service';
import { AuthService } from 'src/app/shared/services/authentication/auth.service';
import { TokenStorageService } from 'src/app/shared/services/authentication/token-storage.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { StoreService } from 'src/app/shared/services/store.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  errorMessage = '';
  errorExist = false;

  showHidePassword = false;
  isRememberMe = false;

  loginON = false;

  isLoggedIn = false;
  isLoginFailed = false;

  activeTab: 'login' | 'register' = 'login';

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private socialAuthService: SocialAuthService,
    private Auth: AuthStatusService,
    private tokenStorage: TokenStorageService,
    private storeService: StoreService,
    private metaInjectorService: MetaInjectorService) {
      this.metaInjectorService.addTag({
        title:'Log In',
        description:'Log In Page',
        ogDescription:'Log In Page',
        ogUrl:'valpal.io/',
        ogTitle:'Log In'
      })
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }

    this.socialAuthService.authState.subscribe((user) => {
      if (user != null && window.location.href.includes('login')) {
        this.tokenStorage.saveRememberMe(true);
        this.login(user.email, user.email, 'google');
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

  async onGoogleSignIn(): Promise<void> {
    // const btnGSign = $(
    //   'asl-google-signin-button div[aria-labelledby="button-label"]'
    // );
    // $(btnGSign).trigger('click');
    const user = await GoogleAuth.signIn()
    if (user !== null) {
      this.tokenStorage.saveRememberMe(true);
      this.login(user.email, user.email, 'google');
    }
  }

  onSubmit(): void {
    const email = this.form.value.email.toLowerCase();
    const password = this.form.value.password;

    this.tokenStorage.saveRememberMe(this.isRememberMe);
    this.login(email, password, 'email');
  }

  login(email: string, password: string, auth_provider: string): void {
    this.loginON = true;
    this.authService.signin(email, password, auth_provider).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveRefreshToken(data.refresh_token);
        this.tokenStorage.saveUser(data);
        this.tokenStorage.saveUserId(data.user._id);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.Auth.changeAuthStatus(true);

        this.storeService.fetchUser()

        setTimeout(() => {
          this.router.navigate(['/overview']);
        }, 500);
        this.errorExist = false;
      },
      error: (error) => {
        this.loginON = false;
        this.errorExist = true;
        this.errorMessage = error.error.error;
      },
    });
  }

  ShowHidePassword(): void {
    const password = document.querySelector('#loginPassword');
    const type =
      password.getAttribute('type') === 'password' ? 'text' : 'password';
    this.showHidePassword = !this.showHidePassword;
    password.setAttribute('type', type);
  }

  ToggleRememberMe(): void {
    this.isRememberMe = !this.isRememberMe;
  }

  logRegCheck(tab: 'login' | 'register'): void {
    this.activeTab = tab;
  }
}

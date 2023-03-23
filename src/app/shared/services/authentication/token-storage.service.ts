import { Injectable } from '@angular/core';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import { StoreService } from '../store.service';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const USER_KEY = 'auth-user';
const USER_ID = 'user_id';

const REMEMBER_ME_KEY = 'remember-me';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private issuer = {
    login: 'http://lobster-app-2-mt6kx.ondigitalocean.app/api/auth/login',
    register: 'http://lobster-app-2-mt6kx.ondigitalocean.app/api/auth/register',
  };

  constructor(private socialAuthService: SocialAuthService,private storeService: StoreService) { }

  signOut(): void {
    window.sessionStorage.clear();
    // window.localStorage.clear();
    window.localStorage.removeItem('auth-refresh-token')
    window.localStorage.removeItem('auth-user')
    window.localStorage.removeItem('auth-token')
    window.localStorage.removeItem('remember-me')
    this.socialAuthService.signOut();
    this.storeService.fetchUser()
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    window.localStorage.removeItem(TOKEN_KEY);
    if (this.getRememberMe() === 'YES') {
      window.localStorage.setItem(TOKEN_KEY, token);
    }

  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public getLocalToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);

    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    if (this.getRememberMe() === 'YES') {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }

  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public getLocalRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    window.localStorage.removeItem(USER_KEY);
    if (this.getRememberMe() === 'YES') {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public saveUserId(user_id: string): void {
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.setItem(USER_ID, user_id);
  }

  public getUserId(): string | null {
    return window.sessionStorage.getItem(USER_ID);
  }

  public getRememberMe(): string | null {
    return window.localStorage.getItem(REMEMBER_ME_KEY);
  }

  public saveRememberMe(remember: boolean): void {
    if (remember) {
      window.localStorage.setItem(REMEMBER_ME_KEY, 'YES');
    } else {
      window.localStorage.removeItem(REMEMBER_ME_KEY);
    }
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }



  isValidToken(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.issuer).indexOf(payload.iss) > -1
          ? true
          : false;
      }
    } else {
      return false;
    }
  }
  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }
  // User state based on valid token
  isLoggedIn(): boolean {
    return this.isValidToken();
  }
}

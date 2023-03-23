import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.api;




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
    ) {}

  signin(email: string, password: string, auth_provider: string): Observable<any> {
    return this.http.post(API + 'auth/login', {
      email,
      password,
      auth_provider
    }, {});
  }
  EnabledNewTransactionNotification(){
    return this.http.get(API + 'users/EnabledNewTransactionNotification', {}); 
  }
  EnabledUpdateNotification(){
    return this.http.get(API + 'users/EnabledUpdateNotification', {}); 
  }
  register(name: string, email: string, password: string, password_confirmation: string, auth_provider: string): Observable<any> {
    return this.http.post(API + 'auth/register', {
      name,
      email,
      password,
      password_confirmation,
      auth_provider
    }, {});
  }

  me(): Observable<any> {
    return this.http.post(API + 'auth/me', {
    }, {});
  }

  // Access user profile
  getLoggedInUser(): Observable<any> {
    return this.http.get(API + 'auth/getLoggedInUser', {});
  }



  // extra
  refreshToken(refresh_token: string): Observable<any> {
    return this.http.post(API + 'auth/refresh', {
      refresh_token: refresh_token
    }, {});
  }

  sendPasswordResetLink(data: any): Observable<any> {
    return this.http.post(API + 'sendPasswordResetEmail', data);
  }


  changePassword(data: any): Observable<any> {
    return this.http.post(API + 'resetPassword', data);
  }
  verifEmail(email: any): Observable<any> {
    return this.http.get(API + 'verifEmailExist/'+email);
  }

  verifCode(email: string,code:string): Observable<any> {
    return this.http.get(API + 'verifCode/'+email+"/"+code);
  }

  sendRegisterLink(data: any): Observable<any> {
    return this.http.post(API + 'sendRegisterLink', data);
  }

  updatePassword(data: any): Observable<any> {
    return this.http.post(API + 'updatePassword', data);
  }

  getResetPasswordData($token): Observable<any> {
    return this.http.get<any>(API + 'getResetPasswordData/' + $token);
  }

}

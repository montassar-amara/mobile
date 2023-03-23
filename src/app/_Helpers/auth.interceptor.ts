import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../shared/services/authentication/auth.service';
import { TokenStorageService } from '../shared/services/authentication/token-storage.service';
import {AuthStatusService} from '../shared/services/authentication/auth-status.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenStorageService: TokenStorageService,
              private authService: AuthService,
              private Auth: AuthStatusService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    let token = this.tokenStorageService.getToken();
    if (token == null && this.tokenStorageService.getRememberMe() === 'YES' && req.url.includes('auth/me')) {
      token = this.tokenStorageService.getLocalToken();
    }

    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }


    return next.handle(authReq)
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse
          && !authReq.url.includes('auth/login')
          && error.status === 401
          && error.error.token_expired) {

          return this.handle401Error(authReq, next);
        }

        return throwError(error);
      }));

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenStorageService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenStorageService.saveToken(token.access_token);
            this.tokenStorageService.saveRefreshToken(token.refresh_token);
            this.refreshTokenSubject.next(token.access_token);

            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.tokenStorageService.signOut();
            this.Auth.changeAuthStatus(false);
            window.location.reload();
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): any {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


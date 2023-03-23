import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {TokenStorageService} from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // tslint:disable-next-line:no-non-null-assertion
  private userState = new BehaviorSubject<boolean>(this.tokenStorageService.isLoggedIn()!);
  userAuthState = this.userState.asObservable();
  constructor(public tokenStorageService: TokenStorageService) {}
  // tslint:disable-next-line:typedef
  setAuthState(value: boolean) {
    this.userState.next(value);
  }
}

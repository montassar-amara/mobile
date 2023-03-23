import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {TokenStorageService} from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStatusService {

  constructor(
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) { }

  private  loggedIn = new BehaviorSubject<boolean>(this.tokenStorageService.isLoggedIn());
  authStatus = this.loggedIn.asObservable();

  changeAuthStatus(value: boolean){
    this.loggedIn.next(value);
  }
}

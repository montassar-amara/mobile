import { Injectable } from '@angular/core'; import { environment } from 'src/environments/environment';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {TokenStorageService} from '../services/authentication/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.tokenStorageService.isLoggedIn();
  }

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router) { }
}

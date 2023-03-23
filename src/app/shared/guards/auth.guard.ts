import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {TokenStorageService} from '../services/authentication/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>  {
      if (this.tokenStorageService.isLoggedIn()) {
        return true;
      } else {
        this.router.navigateByUrl('/');
        return false;
      }

  }

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) {}

}

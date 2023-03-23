import { Injectable } from '@angular/core'; import { environment } from 'src/environments/environment';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {TokenStorageService} from '../services/authentication/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.tokenStorageService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) { }
}

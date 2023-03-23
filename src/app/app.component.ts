import {
  Component,
  ViewEncapsulation,
  OnInit,
  HostListener,
} from '@angular/core';
// import * as GC from '@grapecity/spread-sheets';
// import "@grapecity/spread-sheets-charts";
// import "@grapecity/spread-sheets-barcode";
// import "@grapecity/spread-sheets-print";
// import "@grapecity/spread-sheets-pdf";
// import "@grapecity/spread-sheets-shapes";
// import "@grapecity/spread-sheets-slicers";
// import "@grapecity/spread-sheets-pivot-addon";
// import "@grapecity/spread-sheets-tablesheet";
// import '@grapecity/spread-sheets-designer-resources-en';
// import '@grapecity/spread-sheets-designer';
// import * as GCDesigner from "@grapecity/spread-sheets-designer";

// import * as ExcelIO from '@grapecity/spread-excelio';
import { TokenStorageService } from './shared/services/authentication/token-storage.service';
import { AuthService } from './shared/services/authentication/auth.service';
import { Notifier } from './shared/store/states';
import { StoreService } from './shared/services/store.service';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from './shared/styling_services/theme.service';
import { filter } from 'rxjs/operators';
import { RouterHistoryService } from './shared/services/router-history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  readMoreTerms = false;
  readMorePrivacy = false;
  showCookiesModal = false;
  constructor(
    public themeService: ThemeService,
    private storeService: StoreService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private authService: AuthService,
    private routerHistory: RouterHistoryService
  ) {}

  ngOnInit() {
    // document.addEventListener('contextmenu', event => event.preventDefault());
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((res: NavigationEnd) => {
        if (
          this.routerHistory.currentIndex ===
          this.routerHistory.history.length - 1
        ) {
          if (
            res.urlAfterRedirects.includes('auth') ||
            res.urlAfterRedirects.includes('analyst') ||
            res.urlAfterRedirects.includes('manager') ||
            res.urlAfterRedirects.includes('blank') ||
            this.routerHistory.history.slice(-1)[0] === res.urlAfterRedirects
          ) {
            return;
          }
          this.routerHistory.history.push(res.urlAfterRedirects);
          this.routerHistory.currentIndex += 1;
        } else if (!this.routerHistory.navigating) {
          this.routerHistory.history.splice(
            this.routerHistory.currentIndex + 1
          );
          this.routerHistory.history.push(res.urlAfterRedirects);
          this.routerHistory.currentIndex += 1;
        }
        this.routerHistory.navigating = false;
      });
    this.storeService.fetchCompanies();
    this.storeService.notifier$.subscribe((ntf) => {
      if (ntf === Notifier.ShowPrivacyModal) {
        this.readMorePrivacy = true;
      } else if (ntf === Notifier.ShowTermsModal) {
        this.readMoreTerms = true;
      }
    });

    const isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (isLoggedIn) {
    } else {
      if (this.tokenStorageService.getRememberMe() === 'YES') {
        this.checkRememberMe();
      } else {
        this.tokenStorageService.signOut();
      }
    }

    if (this.tokenStorageService.getRememberMe() === 'YES') {
      this.checkRememberMe();
    }
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   if (event.target.innerWidth < 1024) {
  //     this.router.navigate(['blank']);
  //   } else {
  //     if (window.location.href.includes('blank')) {
  //       this.router.navigate(['/']);
  //     }
  //   }
  // }

  checkRememberMe(): void {
    this.authService.me().subscribe((data) => {
      const localToken = this.tokenStorageService.getLocalToken();
      const localRefreshToken = this.tokenStorageService.getLocalRefreshToken();

      if (localToken && localRefreshToken) {
        this.tokenStorageService.saveToken(localToken);
        this.tokenStorageService.saveRefreshToken(localRefreshToken);
        this.tokenStorageService.saveUserId(data.user._id);

        this.storeService.isLoggedIn$.next(true);
        this.storeService.fetchUser();
      } else {
      }

      this.tokenStorageService.saveUser(data);
    });
  }
}

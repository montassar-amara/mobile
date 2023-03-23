import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { FeedbackAreaService } from 'src/app/shared/styling_services/feedback-area.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICompany } from 'src/app/shared/models/company';
import { NavigationEnd, Router } from '@angular/router';
import { Notifier } from 'src/app/shared/store/states';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuthStatusService } from 'src/app/shared/services/authentication/auth-status.service';
import { TokenStorageService } from 'src/app/shared/services/authentication/token-storage.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { BannerService } from 'src/app/shared/styling_services/banner.service';
import { RouterHistoryService } from 'src/app/shared/services/router-history.service';
import { ContactPopupService } from 'src/app/shared/styling_services/contact-popup.service';
import { DeviceService } from 'src/app/shared/styling_services/device.service';
import { SeePlansService } from 'src/app/shared/styling_services/see-plans.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  mobileLoggedMenuVisible: boolean = false;
  mobileMenuVisible: boolean = false;
  // isSearchbarVisible: boolean = false;
  // isSearchbarTurnedOn: boolean = false;

  isOpen = false;
  urlImg = `background-image:url('${environment.filepath}assets/images/about-us/team.jpg');`;
  gormImg = `background-image:url('${environment.filepath}assets/images/about-us/gorm.png');`;
  jasperImg = `background-image:url('${environment.filepath}assets/images/about-us/jasper.png');`;
  topographyBgImage = 'dark-default';
  topographyBgImageUrl = `background-image: url('assets/icons/topography-pattern/topography-${this.topographyBgImage}.svg');`;
  @Output() onShow = new EventEmitter();

  collapse1: boolean = false;
  changeCollapse1(event: Event) {
    event.stopPropagation();
    this.collapse1 = !this.collapse1;
  }

  isLargeScreen: boolean = window.innerHeight > 1056 ? true : false;

  @HostListener('window:resize', ['$event']) onresize() {
    this.isLargeScreen = window.innerHeight > 1056 ? true : false;
    // this.isSearchbarVisible =
    //   window.innerWidth >= 768 ? true : this.isSearchbarTurnedOn ? true : false;

    this.device.isSmallerMobile = window.innerWidth < 576 ? true : false;
    this.device.isMobile = window.innerWidth < 768 ? true : false;
    this.device.isDesktop = window.innerWidth >= 1024 ? true : false;

    if (window.innerWidth >= 768) {
      this.device.isSearchbarVisible = false;
    }
  }
  preview: boolean = false;
  showPreviewBox: boolean = true;
  filterCompany$ = this.storeService.filterCompany$;
  selectedCompanies$ = this.storeService.selectedCompanies$;
  companiesFilter = 0;
  companyPreview$ = this.storeService.companyPreview$;
  sort$ = new BehaviorSubject<{
    criteria: string;
    direction: 'asc' | 'desc';
  }>({
    criteria: 'alphabetical',
    direction: 'asc',
  });
  searchTerm$ = this.storeService.searchTerm$;
  search$ = combineLatest([this.searchTerm$.pipe(debounceTime(300))]).pipe(
    map(([res]) => res)
  );
  companiesRaw$ = this.storeService.companies$.pipe(
    map((cmp) => cmp.filter((cm) => cm.listed))
  );
  startSelectPlan$ = new BehaviorSubject<boolean>(false);
  startSelectNewPlan$ = new BehaviorSubject<boolean>(false);
  startSelectCampany$ = new Subject();
  user$ = this.storeService.user$;
  subscription$ = this.storeService.subscription$;
  overviewActive = false;
  aboutActive = false;
  companies$ = combineLatest([
    this.companiesRaw$,
    this.sort$,
    this.search$,
    this.filterCompany$,
  ]).pipe(
    map(([companies, sort, search, filter]) => {
      return companies
        .filter((cmp) => {
          if (
            !filter.some((r) => r.checked) ||
            !filter.some((r) => !r.checked)
          ) {
            return true;
          } else if (
            filter
              .filter((r) => r.checked)
              .map((r) => r.name)
              .includes(cmp.sector?.name)
          ) {
            return true;
          }
          return false;
        })
        .filter((c) =>
          c.name.toLowerCase().includes((search ?? '').toLowerCase())
        )
        .sort(
          (a, b) =>
            (a.name > b.name ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1)
        );
    })
  );
  filepath = environment.filepath;
  showTradeInModal = false;
  showContactFAQ = this.contactUs.showContactFAQ;
  showLegalPopup = false;
  toBeTradeIn: any = undefined;
  notifier$ = this.storeService.notifier$;
  blink = false;
  plans$ = this.storeService.plans$;

  search_word$ = this.storeService.search_word$;
  search_elements$ = this.storeService.search_elements$;
  search_index$ = this.storeService.search_index$;
  closeBanner$ = new BehaviorSubject<boolean>(false);
  showBanner$ = combineLatest([this.user$, this.closeBanner$]).pipe(
    map(([user, closed]) => {
      this.bannerSevice.showBanner =
        !user && !localStorage.getItem('showBanner') && !closed;
      // localStorage.clear()
      return !user && !localStorage.getItem('showBanner') && !closed;
      // return true;
    })
  );
  filterCount$ = this.filterCompany$.pipe(
    map((tab) => tab.filter((f) => f.checked).length)
  );
  constructor(
    public plansPopup: SeePlansService,
    public bannerSevice: BannerService,
    public device: DeviceService,
    public themeService: ThemeService,
    public feedbackAreaService: FeedbackAreaService,
    private storeService: StoreService,
    private router: Router,
    private companyService: CompanyService,
    private Auth: AuthStatusService,
    private tokenStorageService: TokenStorageService,
    public routerHistory: RouterHistoryService,
    public contactUs: ContactPopupService
  ) {
    this.router.events.subscribe((res: NavigationEnd) => {
      if (res instanceof NavigationEnd) {
        this.overviewActive = res?.urlAfterRedirects?.includes('/overview');
      }
      if (res instanceof NavigationEnd) {
        this.aboutActive = res?.urlAfterRedirects?.includes('/aboutus');
      }
    });
  }

  ngOnInit(): void {
    this.storeService.startPlanSubs$.subscribe((res) => {
      this.startSelectNewPlan$.next(true);
      this.plansPopup.selectPlanModal = true;
    });
    this.selectedCompanies$.subscribe((res) => {
      if (res.length > 0) {
        this.unlock();
      }
    });
    this.themeService.themeChanged$.subscribe(() => {
      this.switchImage();
    });
    this.companyService.selectedCompany$.subscribe((cmp) => {
      if (cmp) {
        if (this.user$.getValue()) {
          this.selectCompany(cmp);
        }
        this.companyService.selectedCompany$.next(undefined);
      }
    });
    this.filterCompany$.subscribe(
      (res) => (this.companiesFilter = res.filter((r) => r.checked).length)
    );

    this.companyService.fetchSectors().subscribe((res) => {
      this.filterCompany$.next([
        ...res.map((r) => ({ name: r.name, checked: false })),
      ]);
    });
    this.storeService.fetchSubscription();
    this.storeService.fetchPlans();
    this.notifier$.subscribe((notif) => {
      switch (notif) {
        case Notifier.Blink:
          this.blinkIt();
          break;
        case Notifier.TradeInSuccessful:
          this.showTradeInModal = false;
          this.toBeTradeIn = undefined;
      }
    });

    // this.userDataRefresher.getMessage().subscribe((x) => {});

    this.isLargeScreen = window.innerHeight > 1056 ? true : false;

    // this.isSearchbarVisible = window.innerWidth >= 768 ? true : false;

    this.device.isSmallerMobile = window.innerWidth < 576 ? true : false;
  }

  openMobileLoggedMenu(): void {
    this.mobileLoggedMenuVisible = !this.mobileLoggedMenuVisible;

    if (this.mobileLoggedMenuVisible) {
      document.addEventListener('click', (e) => {
        const click = e
          .composedPath()
          .includes(document.querySelector('.mobile-logged-menu'));

        const isToggleBtn = e
          .composedPath()
          .includes(document.querySelector('.mobile-logged-btn'));

        if (!click && !isToggleBtn) {
          this.mobileLoggedMenuVisible = false;
        }
      });
    }
  }
  openMobileMenu(): void {
    this.mobileMenuVisible = !this.mobileMenuVisible;

    if (this.mobileMenuVisible) {
      document.addEventListener('click', (e) => {
        const click = e
          .composedPath()
          .includes(document.querySelector('.left-side'));

        const isToggleBtn = e
          .composedPath()
          .includes(document.querySelector('.mobile-menu-btn'));

        if (!click && !isToggleBtn) {
          this.mobileMenuVisible = false;
        }
      });
    }
  }

  selectCompany(cmp: ICompany) {
    if (this.user$.getValue()) {
      let cmps = this.selectedCompanies$.getValue();
      const subscription = this.subscription$.getValue();
      if (cmps.includes(cmp)) {
        cmps = cmps.filter((c) => c._id !== cmp._id);
      } else {
        const mycmp =
          subscription && subscription._id
            ? [
                ...(subscription.is_active
                  ? subscription?.subscriptionIn
                  : []
                )?.map((r: any) => r.company_id),
                ...subscription?.subscriptionOut?.map((r: any) => r.company_id),
              ].includes(cmp._id)
            : false;
        if (!cmps.includes(cmp) && !mycmp) {
          cmps.push(cmp);
        }
      }
      this.selectedCompanies$.next(cmps);
    }
  }
  removeCompany(index: number) {
    const cmps = this.selectedCompanies$.getValue();
    cmps.splice(index, 1);
    this.selectedCompanies$.next(cmps);
  }
  open(cmp: ICompany) {
    const target = cmp.name.replaceAll(' ', '_');
    this.router.navigate(['', target]);
  }
  selectCompanyTradeIn(cmp: ICompany) {
    this.showTradeInModal = true;
    this.toBeTradeIn = cmp;
  }
  confirmTradeIn(btn: HTMLButtonElement) {
    btn.disabled = true;
    this.storeService.subscriptionTradIn(this.toBeTradeIn._id);
  }
  cancelTradeIn() {
    this.toBeTradeIn = undefined;
    this.showTradeInModal = false;
  }
  sortCompanies() {
    const res = this.sort$.getValue();
    res.direction = res.direction === 'asc' ? 'desc' : 'asc';
    this.sort$.next(res);
  }
  unlock() {
    if (this.selectedCompanies$.getValue().length === 0) {
      this.blinkIt();
    } else {
      this.startSelectCampany$.next(true);
    }
  }
  blinkIt() {
    this.blink = true;
    setTimeout(() => {
      this.blink = false;
    }, 1000);
  }
  logout() {
    this.tokenStorageService.signOut();
    this.Auth.changeAuthStatus(false);
    this.router.navigateByUrl('/overview');
    this.storeService.cleanUp();
    this.collapse1 = !this.collapse1;
    this.selectedCompanies$.next([]);
  }
  updateFilter(event: boolean, index: number) {
    const tmp = this.filterCompany$.getValue();
    tmp[index].checked = event;
    this.filterCompany$.next(tmp);
  }
  removeFilter(index: number) {
    const tmp = this.filterCompany$.getValue();
    tmp[index].checked = false;
    this.filterCompany$.next(tmp);
  }
  removeFilters() {
    const tmp = this.filterCompany$.getValue();
    this.filterCompany$.next(
      tmp.map((r) => {
        r.checked = false;
        return r;
      })
    );
  }
  closeDropdown(event: Event) {
    if (this.collapse1) {
      document.getElementById('btntoggle').click();
    }
    if (!this.isLargeScreen) {
      const menu = document.getElementById('btntogglemenu') as HTMLElement;
      if (!menu.classList.contains('collapsed')) {
        menu.click();
      }
    }
  }

  next() {
    this.routerHistory.next$.next(true);
  }
  previous() {
    this.routerHistory.previous$.next(true);
  }
  onSearch() {
    this.storeService.onSerch$.next(true);
  }
  moveToNext() {
    this.storeService.moveNext$.next(true);
  }
  moveToBack() {
    this.storeService.moveBack$.next(true);
  }
  closeBanner() {
    localStorage.setItem('showBanner', 'removed');
    this.closeBanner$.next(true);
  }
  switchImage() {
    switch (this.themeService.activeTheme) {
      case 'light-default':
        this.topographyBgImage = 'light-default';
        break;
      case 'solarized-light':
        this.topographyBgImage = 'solarized-light';
        break;
      case 'light-default':
        this.topographyBgImage = 'light-default';
        break;
      case 'light-test':
        this.topographyBgImage = 'light-test';
        break;
      case 'dark-default':
        this.topographyBgImage = 'dark-default';
        break;
      case 'dark-test':
        this.topographyBgImage = 'dark-test';
        break;
      case 'solarized-dark':
        this.topographyBgImage = 'solarized-dark';
        break;

      default:
        this.topographyBgImage = 'dark-default';
        break;
    }

    this.topographyBgImageUrl = `background-image: url('assets/icons/topography-pattern/topography-${this.topographyBgImage}.svg');`;
  }

  openPrivacy(): void {
    this.storeService.updateNotifier(Notifier.ShowPrivacyModal);
  }
  openTerms(): void {
    this.storeService.updateNotifier(Notifier.ShowTermsModal);
  }
}

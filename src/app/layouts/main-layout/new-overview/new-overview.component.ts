import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { CompanyService } from 'src/app/shared/services/company.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { BannerService } from 'src/app/shared/styling_services/banner.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-overview',
  templateUrl: './new-overview.component.html',
  styleUrls: ['./new-overview.component.scss'],
})
export class NewOverviewComponent implements OnInit {
  static startColor = '#FFFF00';
  static endColor = '#FF0000';
  static color = '#545454';
  colorByTheme = '#545454';
  companiesFilter = 0;
  get staticColor() {
    return NewOverviewComponent.color;
  }
  start = Date.now();
  filepath = environment.filepath;
  sectors$ = this.companyService.fetchSectors();
  filterCompany$ = this.storeService.filterCompany$;
  searchTerm$ = this.storeService.searchTerm$;
  subscription$ = this.storeService.subscription$;
  selectedCompanies$ = this.storeService.selectedCompanies$;
  __companies$ = this.storeService.companies$.pipe(map(cmp=>cmp.filter(cm=>cm.listed)));
  mycompanies$ = this.subscription$.pipe(
    map((subs) => {
      let mycmps = [];
      if (subs) {
        if (subs.subscriptionIn && subs.subscriptionIn.length > 0) {
          mycmps = [
            ...mycmps,
            ...subs.subscriptionIn.map((c: any) => c.company_id),
          ];
        }
        if (subs.subscriptionOut && subs.subscriptionOut.length > 0) {
          mycmps = [
            ...mycmps,
            ...subs.subscriptionOut.map((c: any) => c.company_id),
          ];
        }
      }
      return mycmps;
    })
  );
  search$ = combineLatest([this.searchTerm$.pipe(debounceTime(300))]).pipe(
    map(([res]) => res)
  );
  sort$ = new BehaviorSubject<{
    criteria: string;
    direction: 'asc' | 'desc';
  }>({
    criteria: 'alphabetical',
    direction: 'asc',
  });
  companies$ = combineLatest([
    this.__companies$,
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
  mySectors$ = combineLatest([
    this.sectors$,
    this.mycompanies$,
    this.__companies$,
    this.subscription$,
  ]).pipe(
    map(([sectors, mycmps, companies, subs]) => {
      const mysectors = [];
      sectors.forEach((sector) => {
        const tmp = companies.filter(
          (cmp) =>
            cmp.sector?.name === sector?.name &&
            (mycmps.includes(cmp._id) || subs?.type === 'free')
        );
        if (tmp && tmp.length > 0) {
          mysectors.push({ ...sector, companies: tmp });
        }
      });
      return mysectors;
    })
  );
  user$ = this.storeService.user$.asObservable();

  companyCardHovered: boolean = false;

  
  @ViewChild('companiesHeader') companiesHeader!: ElementRef;
  isCompaniesHeaderFixed: boolean = false;
  @HostListener('window:scroll', ['$event']) onScroll(event: Event) {
    if (this.bannerSevice.showBanner) {
      // here 54 --> because banner has hight = 40px + 12px dark border top + 2px
      if (
        this.companiesHeader?.nativeElement.getBoundingClientRect().top <= 54
      ) {
        this.isCompaniesHeaderFixed = true;
      } else {
        this.isCompaniesHeaderFixed = false;
      }
    } else {
      if (
        this.companiesHeader?.nativeElement.getBoundingClientRect().top <= 12
      ) {
        this.isCompaniesHeaderFixed = true;
      } else {
        this.isCompaniesHeaderFixed = false;
      }
    }
  }

  activeTab: string = 'all';
  filterCount$ = this.filterCompany$.pipe(
    map((tab) => tab.filter((f) => f.checked).length)
  );
  constructor(
    public bannerSevice: BannerService,
    public themeService: ThemeService,
    private companyService: CompanyService,
    private storeService: StoreService,
    private router: Router,
    private metaInjectorService: MetaInjectorService,
  ) {}

  ngOnInit(): void {
    this.swithColorByTheme()
    combineLatest([this.router.events,this.themeService.themeChanged$]).subscribe(([res,_])=>{
      this.swithColorByTheme()
    })
    this.sectors$.subscribe((res) => {
      this.filterCompany$.next([
        ...res.map((r) => ({ name: r.name, checked: false })),
      ]);
    });
    this.filterCompany$.subscribe(
      (res) => (this.companiesFilter = res.filter((r) => r.checked).length)
    );
      this.metaInjectorService.addTag({
        title: 'Research',
        description: 'a study of ',
        ogDescription: 'a study of ',
        ogUrl: 'valpal.io/',
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  swithColorByTheme(){
    const currentTheme=this.themeService.activeTheme
    switch (currentTheme) {
      // case 'light-default':
      //   this.colorByTheme = '#ffffff';
      //   NewOverviewComponent.color = '#ffffff';
      //   break;
      //   case 'solarized-light':
      //     this.colorByTheme = '#eee8d5';
      //     NewOverviewComponent.color = '#eee8d5';
      //   break;
      //   case 'light-test':
      //     this.colorByTheme = '#f3f3f3';
      //     NewOverviewComponent.color = '#f3f3f3';
      //   break;
        case 'dark-test':
          this.colorByTheme = '#181818';
          NewOverviewComponent.color = '#181818';
        break;
        case 'dark-default':
          this.colorByTheme = '#181818';
          NewOverviewComponent.color = '#181818';
        break;
        case 'solarized-dark':
          this.colorByTheme = '#002b36';
          NewOverviewComponent.color = '#002b36';
        break;
      default:
        break;
    }
  }
  selectCompany(data:any) {
    const {event,company} = data
    event.stopPropagation();
    this.companyService.selectedCompany$.next(company);
  }
  open(data:any) {
    const {event,company} = data
    if ([...document.querySelectorAll('#c-tag')].includes(event.target)) {
      return;
    }
    this.router.navigate(['', company.name.replaceAll(' ', '_')]);
  }
  fadeIn(color: string) {
    NewOverviewComponent.startColor = NewOverviewComponent.color;
    NewOverviewComponent.endColor = color;
    this.start = Date.now();
    this.animate();
    this.companyCardHovered = true;
  }
  fadeOut() {
    NewOverviewComponent.startColor = NewOverviewComponent.color;
    NewOverviewComponent.endColor = this.colorByTheme;
    this.start = Date.now();
    this.animate();
    this.companyCardHovered = false;
  }
  animate() {
    let start = this.start;

    function animateInner() {
      let time = Date.now() - start;
      let progress = time / 500; // animation duration
      let opacity = Math.min(progress, 1);
      let startColorRgb = NewOverviewComponent.hexToRgb(
        NewOverviewComponent.startColor
      );
      let endColorRgb = NewOverviewComponent.hexToRgb(
        NewOverviewComponent.endColor
      );

      let r = startColorRgb.r + (endColorRgb.r - startColorRgb.r) * opacity;
      let g = startColorRgb.g + (endColorRgb.g - startColorRgb.g) * opacity;
      let b = startColorRgb.b + (endColorRgb.b - startColorRgb.b) * opacity;
      NewOverviewComponent.color = NewOverviewComponent.rgbToHex(r, g, b);

      if (progress < 1) {
        requestAnimationFrame(animateInner);
      }
    }

    requestAnimationFrame(animateInner.bind(this));
  }
  static rgbToHex(r, g, b) {
    let hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
  }
  static hexToRgb(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
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
  removeFilter(index: number) {
    const tmp = this.filterCompany$.getValue();
    tmp[index].checked = false;
    this.filterCompany$.next(tmp);
  }
  updateFilter(event: boolean, index: number) {
    const tmp = this.filterCompany$.getValue();
    tmp[index].checked = event;
    this.filterCompany$.next(tmp);
  }
  
}

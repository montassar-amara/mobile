import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { combineLatest, lastValueFrom, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ICompany } from '../../../shared/models/company';
import { CompanyService } from '../../../shared/services/company.service';
import { environment } from '../../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import { StoreService } from 'src/app/shared/services/store.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { ISubscription } from '../../../shared/models/subscription';
import { BannerService } from 'src/app/shared/styling_services/banner.service';
import { DeviceService } from 'src/app/shared/styling_services/device.service';

const enterTransition = transition('void => *', [
  style({ flexBasis: 0 }),
  animate('1s ease-in', style({ flexBasis: '250px' })),
]);

const exitTransition = transition('* => void', [
  style({ flexBasis: '250px' }),
  animate('1s ease-out', style({ flexBasis: 0 })),
]);

const fadeIn = trigger('fadeIn', [enterTransition]);
const fadeOut = trigger('fadeOut', [exitTransition]);

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: ['./company-preview.component.scss'],
  animations: [fadeIn, fadeOut],
})
export class CompanyPreviewComponent implements OnInit, OnDestroy {
  param$ = new Subject<String>();
  user$ = this.storeService.user$;
  selectedReportIsFree = false;
  companies$ = this.storeService.companies$;
  reportPublishDate: any = undefined;
  company$ = combineLatest([
    this.param$.pipe(distinctUntilChanged()),
    this.companies$.pipe(distinctUntilChanged()),
  ])
    .pipe(
      map(([name, list]) => {
        if (name) {
          const cmp = list.find((c) => c.name === name);
          this.metaInjectorService.addTag({
            title: cmp?.name,
            description: cmp?.meta_description ?? 'a study of ' + cmp?.name,
            ogDescription: cmp?.meta_description ?? 'a study of ' + cmp?.name,
            ogUrl: 'valpal.io/',
          });
          if (cmp) {
            document.getElementById('scrollBar').scrollTop = Number(
              localStorage.getItem('scroll-' + cmp._id) ?? 0
            );
          }
          return cmp;
        }
      })
    )
    .subscribe((data) => {
      if (data) {
        this.company_data = data;
        this.getRatingList();
        this.getCompanyReport(data?._id);
      }
    });

  @ViewChild('textContainer') textContainer!: ElementRef;

  @ViewChild('headerTable') headerTable!: ElementRef;

  company_data: ICompany = null;
  report_list: any = [];
  selected_report_id = -1;
  rating_list = [];

  show_table_content!: boolean;
  show_table_content_to_user!: boolean;
  selected_section_index = -1;
  selected_element_index = -1;

  report_data = null;
  section_list = [];
  search_word$ = this.storeService.search_word$;

  marker_ticks: any[] = [];
  search_index$ = this.storeService.search_index$;
  search_elements$ = this.storeService.search_elements$;

  filepath = environment.filepath;
  isTableHeaderFixed: boolean = false;
  subscription$ = this.storeService.subscription$;
  analysts = [];
  selectedAnalyst = undefined;
  public colapsed: boolean[] = [];

  @HostListener('window:scroll', ['$event']) onScroll(event: Event) {
    localStorage.setItem(
      'scroll-' + this.company_data._id,
      `${(event.target as HTMLElement).scrollTop}`
    );
    if ((event.target as HTMLElement).scrollTop > 250) {
      const el = document.getElementById('floating-action');
      // if (el) {
      //   el.classList.remove('d-none');
      //   el.style.top = `${(event.target as HTMLElement).scrollTop}px`;
      // }
    }

    // is header & report table fixed
    if (this.bannerSevice.showBanner) {
      if (this.device.isSmallerMobile) {
        if (this.headerTable.nativeElement.getBoundingClientRect().top <= 117) {
          this.isTableHeaderFixed = true;
        } else {
          this.isTableHeaderFixed = false;
        }
      } else {
        if (this.headerTable.nativeElement.getBoundingClientRect().top <= 97) {
          this.isTableHeaderFixed = true;
        } else {
          this.isTableHeaderFixed = false;
        }
      }
    } else {
      if (this.headerTable.nativeElement.getBoundingClientRect().top <= 57) {
        this.isTableHeaderFixed = true;
      } else {
        this.isTableHeaderFixed = false;
      }
    }

    this.setTableMaxHeight();
  }

  tableMaxHeight: string = '';

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
    private companyService: CompanyService,
    public themeService: ThemeService,
    public bannerSevice: BannerService,
    public device: DeviceService,
    private metaInjectorService: MetaInjectorService,
    private router: Router
  ) {
    this.colapsed = this.section_list.map((item) => true);

    this.device.isSearchbarVisible = false;
  }
  ngOnDestroy(): void {
    this.storeService.companyPreview$.next(false);
    this.storeService.search_word$.next('');
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (_) => {
      this.selectedReportIsFree = false;

      this.storeService.onSerch$.subscribe(() => {
        this.onSearch();
      });
      this.storeService.moveBack$.subscribe(() => {
        this.moveToBack();
      });
      this.storeService.moveNext$.subscribe(() => {
        this.moveToNext();
      });
      // this.companyService.tableContentState$.subscribe((res) => {
      //   this.show_table_content = res;
      // });
      // this.store.dispatch(fetchSubscription())
      this.analysts = await lastValueFrom(this.companyService.getAnalyst());
      setTimeout(() => {
        this.storeService.companyPreview$.next(true);
        this.route.paramMap.subscribe((params: ParamMap) => {
          const name = params.get('name').replaceAll('_', ' ');
          this.param$.next(name);
          this.metaInjectorService.addTag({
            title: name,
            description: 'a study of ' + name,
            ogDescription: 'a study of ' + name,
            ogUrl: 'valpal.io/',
          });
          this.selected_section_index = -1;
          this.selected_element_index = -1;

          this.search_word$.next('');
          this.search_elements$.next([]);
        });
      }, 0);
    });

    this.device.isSmallerMobile = window.innerWidth < 576 ? true : false;
    this.device.isMobile = window.innerWidth < 768 ? true : false;

    this.setTableMaxHeight();
  }

  setTableMaxHeight(): void {
    let bodyHeight = document.body.offsetHeight;
    let tableTopPosition = document
      .querySelector('.report-table-contents')
      .getBoundingClientRect().top;

    this.tableMaxHeight = bodyHeight - tableTopPosition - 8 + 'px';
  }

  myCollapse(i: number): void {
    let isColapsed = this.colapsed[i];
    this.colapsed = this.section_list.map((item) => false);

    if (isColapsed) {
      this.colapsed[i] = false;
    } else {
      this.colapsed[i] = true;
    }
  }

  toggleTableContent(): void {
    // this.companyService.tableContentState$.next(!this.show_table_content);

    this.show_table_content = !this.show_table_content;
  }

  onReportSelect(index: number): void {
    this.search_word$.next('');
    this.search_elements$.next([]);
    this.selected_report_id = index;
    this.report_data = this.report_list[index].report_data;
    this.reportPublishDate = this.report_list[index].updated_at;
    this.show_table_content_to_user = this.report_list[index].table_content;
    this.selectedReportIsFree = this.report_list[index].is_free;
    this.selectedAnalyst = this.analysts.find(
      (a) => a._id === this.report_list[index].analyst_id
    );
    this.section_list = this.report_list[index].section_list;

    this.refreshSelectedRating();
  }

  onTableSectionSelect(section_index: number): void {
    this.selected_section_index = section_index;
    this.selected_element_index = -1;

    // this.colapsed

    this.scroll(`section-${section_index}`);
  }

  onTableElementSelect(section_index: number, element_index: number): void {
    this.selected_section_index = section_index;
    this.selected_element_index = element_index;

    this.scroll(`section-${section_index}-element-${element_index}`);
  }

  isReportActive(): boolean {
    const value: ICompany = this.company_data;
    const subs: ISubscription = this.subscription$.getValue();

    if (!subs?._id && !subs?.subscriptionIn) {
      return false;
    }

    if (subs?._id && subs?.type === 'free') {
      return true;
    }

    return [
      ...(subs?.is_active && !(subs?.type === 'free')
        ? subs?.subscriptionIn.map((r: any) => r.company_id)
        : []),
      ...subs?.subscriptionOut.map((r: any) => r.company_id),
    ].includes(value?._id);
  }

  getCompanyReport(company_id: string): void {
    if (company_id) {
      this.companyService
        .getCompanyReport(company_id)
        .subscribe((res: any[]) => {
          this.report_list = res.sort(
            (a, b) => +Date.parse(b.updated_at) - +Date.parse(a.updated_at)
          );
          if (this.report_list.length > 0) {
            this.report_data = this.report_list[0].report_data;
            this.reportPublishDate = this.report_list[0].updated_at;
            this.show_table_content_to_user = this.report_list[0].table_content;
            this.section_list = this.report_list[0].section_list;
            this.selectedAnalyst = this.analysts.find(
              (a) => a._id === this.report_list[0].analyst_id
            );
            this.selected_report_id = 0;
          } else {
            this.report_data = null;

            this.section_list = [];

            this.selected_report_id = -1;
          }

          this.refreshSelectedRating();
        });
    }
  }

  getRatingList() {
    this.rating_list = [
      {
        _id: 'overall_rating',
        name: 'Overall Rating',
        value: this.company_data?.overalRating ?? 0.0,
      },
    ];

    if (this.company_data?.ratings) {
      this.company_data.ratings.forEach((rating) => {
        this.rating_list = [
          ...this.rating_list,
          {
            _id: rating._id,
            name: rating.name,
            value: rating.value,
          },
        ];
      });
    }
  }

  refreshSelectedRating() {
    if (
      this.report_data?.selected_rating &&
      this.report_data?.selected_rating._id
    ) {
      const rating = this.rating_list.find((item) => {
        return item._id === this.report_data.selected_rating._id;
      });

      this.report_data.selected_rating = rating;
    } else if (this.report_data) {
      this.report_data.selected_rating = this.rating_list[0];
    }

    this.section_list.map((section) => {
      if (section.selected_rating && section.selected_rating._id) {
        const rating = this.rating_list.find((item) => {
          return item._id == section.selected_rating._id;
        });

        section.selected_rating = rating;
      } else {
        section.selected_rating = this.rating_list[0];
      }
    });
    this.cd.detectChanges();
  }

  scroll(element_id) {
    const targetEle = document.getElementById(element_id);

    let pos = targetEle.style.position;
    let top = targetEle.style.top;
    targetEle.style.position = 'relative';
    targetEle.style.top = '-60px';
    targetEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    targetEle.style.top = top;
    targetEle.style.position = pos;
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd hh:MM', 'en-US');
  }

  getMarkerTicks() {
    setTimeout(() => {
      this.search_elements$.next(
        this.textContainer.nativeElement.querySelectorAll('.highlighted-text')
      );

      this.search_index$.next(1);

      const first_element =
        this.textContainer.nativeElement.querySelectorAll(
          '.highlighted-text'
        )[0];

      // first_element.focus();
      if (first_element) {
        first_element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }, 100);
  }
  onSearch() {
    if (this.textContainer) this.textContainer.nativeElement.scrollTop = 0;
    this.getMarkerTicks();
  }
  moveToNext() {
    const highlightedSpans =
      this.textContainer?.nativeElement.querySelectorAll('.highlighted-text');
    if (highlightedSpans?.length > 0) {
      if (this.search_index$.getValue() === highlightedSpans.length) {
        this.search_index$.next(0);
      }
      this.search_index$.next(this.search_index$.getValue() + 1);

      this.search_elements$
        .getValue()
        [this.search_index$.getValue() - 1].focus();
    }
  }
  moveToBack() {
    const highlightedSpans =
      this.textContainer?.nativeElement.querySelectorAll('.highlighted-text');

    if (highlightedSpans?.length > 0) {
      if (this.search_index$.getValue() === 1) {
        this.search_index$.next(highlightedSpans.length + 1);
      }
      this.search_index$.next(this.search_index$.getValue() - 1);
      this.search_elements$
        .getValue()
        [this.search_index$.getValue() - 1].focus();
    }
  }

  numSequence(n: number): Array<number> {
    return Array(Number(n));
  }

  getBackgroundColor(i: number, j: number) {
    if (i == 0) {
      return 'rgba(48, 48, 48, 0.3)';
      // return 'var(--bg-400)';
    } else if (i > 0 && j == 0) {
      return 'rgba(48, 48, 48, 0.3)';
      // return 'rgba(var(--bg-400)';
    }

    return 'rgba(33, 33, 33, 0.3)';
    // return 'var(--bg-300)';
  }

  print(r) {
    return Number(r);
  }
  log(t: any) {
    return t;
  }
  unlockCompany() {
    if (this.user$.getValue()) {
      this.companyService.selectedCompany$.next(this.company_data);
    } else {
      this.router.navigate(['auth/login']);
    }
  }
  trackBy(index: number, name: any): string {
    return name._id;
  }
}

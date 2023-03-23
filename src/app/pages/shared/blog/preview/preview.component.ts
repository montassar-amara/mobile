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
import { animate, style, transition, trigger } from '@angular/animations';
import { StoreService } from 'src/app/shared/services/store.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { BannerService } from 'src/app/shared/styling_services/banner.service';
import { DeviceService } from 'src/app/shared/styling_services/device.service';
import { environment } from 'src/environments/environment';
import { CompanyService } from 'src/app/shared/services/company.service';
import { BlogService } from 'src/app/shared/services/blog.service';

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
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations: [fadeIn, fadeOut],
})
export class PreviewComponent implements OnInit, OnDestroy {
  selectedReportIsFree = false;
  reportPublishDate: any = undefined;

  @ViewChild('textContainer') textContainer!: ElementRef;

  @ViewChild('headerTable') headerTable!: ElementRef;

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
  analysts = [];
  selectedAnalyst = undefined;
  public colapsed: boolean[] = [];

  @HostListener('window:scroll', ['$event']) onScroll(event: Event) {
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
  }

  constructor(
    private storeService: StoreService,
    private companyService: CompanyService,
    public themeService: ThemeService,
    public bannerSevice: BannerService,
    public device: DeviceService,
    // private metaInjectorService: MetaInjectorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
  ) {
    this.colapsed = this.section_list.map((item) => true);
  }
  ngOnDestroy(): void {
    this.storeService.companyPreview$.next(false);
    this.storeService.search_word$.next('');
  }

  async ngOnInit(): Promise<void> {
    this.getBlog()
    this.activatedRoute.params.subscribe(async (_) => {
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
      this.companyService.tableContentState$.subscribe((res) => {
        this.show_table_content = res;
      });
      // this.store.dispatch(fetchSubscription())
      this.analysts = await lastValueFrom(this.companyService.getAnalyst());
    });

    this.device.isSmallerMobile = window.innerWidth < 576 ? true : false;
    this.device.isMobile = window.innerWidth < 768 ? true : false;
  }

  myCollapse(i: number): void {
    this.colapsed = this.section_list.map((item) => false);
    this.colapsed[i] = true;
  }

  toggleTableContent(): void {
    this.companyService.tableContentState$.next(!this.show_table_content);
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
  getBlog(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const date = params.get('id')
      const name = params.get('title')
      this.blogService.fetch().subscribe((res:any[])=>{
        const id = res.find(b=>b.news_data?.title.replaceAll(' ','_')===name)
        this.blogService.fetchOne(id?._id).subscribe((blog:any)=>{
          this.report_data = blog.news_data;
          this.reportPublishDate = blog.updated_at;
          this.show_table_content_to_user = blog.table_content;
          this.section_list = blog.section_list;
          this.selectedAnalyst = this.analysts.find(
            (a) => a._id === blog.analyst_id
          );
        })
      })
      
     
    });
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
  trackBy(index: number, name: any): string {
    return name._id;
  }
}

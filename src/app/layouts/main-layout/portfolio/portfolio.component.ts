import { Component, OnInit, ViewChild } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { IPortfolio } from 'src/app/shared/models/portfolio';
import { BlogService } from 'src/app/shared/services/blog.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { SharesApiService } from 'src/app/shared/services/shares-api.service';

import { Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  isYoutube = false;
  @ViewChild('chart') chart: UIChart;
  month = new Date();
  data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  vars = {
    autoplay: 0,
    showinfo: 0,
    controls: 0,
  };
  dataMAG: any;
  activeTab = 0;
  youtubeModal = false;
  selectedBlog = undefined;

  axesTextColor: string = 'var(--danger);';
  options = {
    scales: {
      // it is not xAxes
      x: {
        ticks: {
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#D3D3D3',
        },
        scaleLabel: {
          display: true,
          labelString: 'Month',
          fontSize: 14,
          fontFamily: 'Arial',
          fontColor: '#000',
        },
        grid: {
          color: '#a1a1a133',
        },
      },

      // it is not yAxes
      y: {
        ticks: {
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#D3D3D3',
          callback: function (label, index, labels) {
            return label + '%';
          },
        },
        scaleLabel: {
          display: true,
          labelString: 'Sales',
          fontSize: 14,
          fontFamily: 'Arial',
          fontColor: '#000',
        },
        grid: {
          color: '#a1a1a133',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => {
            const { formattedValue } = item;
            const label = Number.parseFloat(formattedValue).toFixed(1) + '%';

            return label;
          },
        },
      },
      datalabels: {
        display: true,
        color: 'red' /* set the font color of data labels to red */,
        borderColor: '#000' /* set the border color of data labels to black */,
        borderWidth: 1 /* set the border width of data labels to 1 pixel */,
      },
    },
  };
  optionsPie = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => {
            const { formattedValue } = item;
            const label = Number.parseFloat(formattedValue).toFixed(1) + '%';

            return label;
          },
        },
      },
    },
  };
  portfolio: IPortfolio = undefined;
  total = 0;
  stocksValue = 0;
  history: any[] = [];
  isYearly = 'Yearly';
  blogs: any[] = [];

  topographyBgImage = 'dark-default';
  topographyBgImageUrl = `background-image: url('assets/icons/topography-pattern/topography-${this.topographyBgImage}.svg');`;

  // @HostListener('window:scroll', ['$event']) onScroll(
  //   event: Event,
  //   id: string
  // ) {
  //   const tableHeader = document.getElementById(id);

  //   console.log(tableHeader.offsetTop);
  // }
  subscription$ = this.storeService.subscription$;
  constructor(
    private metaInjectorService: MetaInjectorService,
    private router: Router,
    private stockService: SharesApiService,
    private blogService: BlogService,
    private storeService: StoreService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.themeChanged$.subscribe(() => {
      this.switchImage();

      setTimeout(() => {
        const style = getComputedStyle(
          document.getElementsByTagName('app-main-layout')[0]
        );
        const gridColor = style.getPropertyValue('--main-text-color-20');
        const labelColor = style.getPropertyValue('--secondary-text-color');
        this.options.scales.x.grid.color = gridColor;
        this.options.scales.y.grid.color = gridColor;
        this.options.scales.x.ticks.color = labelColor;
        this.options.scales.y.ticks.color = labelColor;
        this.chart?.refresh();
      }, 100);
    });
    this.blogService
      .fetch()
      .subscribe((res: any[]) => (this.blogs = res.reverse().filter(b=>b.is_published)));
    this.stockService.transactionHistory().subscribe((res: any[]) => {
      this.storeService.companies$
        .pipe(
          filter((cmps) => cmps.length > 0),
          take(1)
        )
        .subscribe((cmps) => {
          this.history = res.reverse().map((h) => ({
            ...h,
            color: cmps.find((c) => c._id === h.company_id)?.color,
          }));
        });
    });
    this.stockService
      .fetchPortfolio()
      .pipe(take(1))
      .subscribe((portfolio) => {
        this.portfolio = portfolio;
        this.stocksValue = portfolio.companyPortfolio
          .map((p) => p.shares * p.now_price)
          .reduce((a, b) => a + b, 0);
        this.total = portfolio.amount + this.stocksValue;
        this.storeService.companies$
          .pipe(
            filter((cmps) => cmps.length > 0),
            take(1)
          )
          .subscribe((cmps) => {
            this.portfolio.companyPortfolio = portfolio.companyPortfolio.map(
              (p) => {
                return {
                  ...p,
                  ...cmps.find((c) => c._id === p.company_id),
                  percent: this.getPercent(p),
                };
              }
            );
            this.data = {
              labels: [
                'Available funds',
                ...portfolio.companyPortfolio.map((position) => position.name),
              ],
              datasets: [
                {
                  data: [
                    (portfolio.amount / this.total) * 100,
                    ...this.portfolio.companyPortfolio.map(
                      (p) => p.percent * 100
                    ),
                  ],
                  backgroundColor: ['#000000',...this.portfolio.companyPortfolio.map(
                    (position) => position.color
                  )],
                  hoverBackgroundColor: [],
                },
              ],
            };
            this.updatePerformance('Yearly');
          });
      });
    this.metaInjectorService.addTag({
      title: 'Portfolio',
      description: 'a study of ',
      ogDescription: 'a study of ',
      ogUrl: 'valpal.io/',
    });
  }
  getPercent(p: any) {
    return (p.shares * p.now_price) / this.total;
  }

  updatePerformance(res: string) {
    this.isYearly = res;
    if (this.isYearly === 'Yearly') {
      this.stockService.yearlyPerformance().subscribe((res: any) => {
        let array = [];
        if (new Date(res[0].updated_at).getMonth() > 1) {
          array = Array.from({
            length: new Date(res[0].updated_at).getMonth(),
          }).fill(0);
        }
        this.dataMAG = {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [
            {
              label: 'Performance',
              data: [...array, ...res.map((r) => (r.performance - 1) * 100)],
              borderColor: '#42A5F5',
              tension: 0.4,
              fill: false,
            },
          ],
        };
      });
    } else {
      this.stockService.monthlyPerformance().subscribe((res: any) => {
        const now = new Date();
        const nb = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        let array = [];
        if (new Date(res[0].updated_at).getDate() > 1) {
          array = Array.from({
            length: new Date(res[0].updated_at).getDate() - 1,
          }).fill(0);
        }
        this.dataMAG = {
          labels: Array.from({ length: nb }).map((_, i) => i + 1),
          datasets: [
            {
              label: 'Performance',
              data: [...array, ...res.map((r) => (r.performance - 1) * 100)],
              borderColor: '#42A5F5',
              tension: 0.4,
              fill: false,
            },
          ],
        };
      });
    }
  }
  previewBlog(blog: any) {
    // this.blogService.selectedBlog$.next(blog);
    if (!blog.link) {
      const date = new Date(blog.publish_at)
      this.router.navigate(['/blog',date.toLocaleDateString('en-US').replaceAll('/','-'),blog.news_data?.title.replaceAll(' ','_')]);
    } else {
      this.youtubeModal = true;
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = blog.link.match(regExp);
      this.isYoutube = match && match[7].length == 11 ? match[7] : false;
      this.selectedBlog = blog;
    }
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
}

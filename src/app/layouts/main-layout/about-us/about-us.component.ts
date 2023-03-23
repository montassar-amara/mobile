import { Component, OnInit } from '@angular/core';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { ContactPopupService } from 'src/app/shared/styling_services/contact-popup.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  urlImg = `background-image:url('${environment.filepath}assets/images/about-us/team.jpg');`;
  gormImg = `background-image:url('${environment.filepath}assets/images/about-us/gorm.png');`;
  jasperImg = `background-image:url('${environment.filepath}assets/images/about-us/jasper.png');`;
  

  topographyBgImage = 'dark-default';
  topographyBgImageUrl = `background-image: url('assets/icons/topography-pattern/topography-${this.topographyBgImage}.svg');`;
  constructor(
    private metaInjectorService: MetaInjectorService,
    public themeService: ThemeService,
    public contactUs: ContactPopupService
  ) {
    this.metaInjectorService.addTag({
      title: 'What, How & Why',
      description: 'About us ',
      ogDescription: 'About us ',
      ogUrl: 'valpal.io/',
      ogTitle: 'About Us',
    });
  }

  ngOnInit(): void {
    this.themeService.themeChanged$.subscribe(() => {
      this.switchImage();
    });
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

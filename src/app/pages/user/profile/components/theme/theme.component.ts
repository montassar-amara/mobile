import { Component, OnInit } from '@angular/core';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit {
  constructor(public themeService: ThemeService,private metaInjectorService: MetaInjectorService) {
    this.metaInjectorService.addTag({
      title:'App Settings',
      description:'App Settings ',
      ogDescription:'App Settings ',
      ogUrl:'valpal.io/',
      ogTitle:'App Settings'
    })
  }

  ngOnInit(): void {}
}

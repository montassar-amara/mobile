import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-analyst-header',
  templateUrl: './analyst-header.component.html',
  styleUrls: ['./analyst-header.component.scss'],
})
export class AnalystHeaderComponent implements OnInit {
  activeTheme: string;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.activeTheme = this.themeService.activeTheme;
  }
}

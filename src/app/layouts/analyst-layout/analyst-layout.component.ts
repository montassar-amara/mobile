import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-analyst-layout',
  templateUrl: './analyst-layout.component.html',
  styleUrls: ['./analyst-layout.component.scss']
})
export class AnalystLayoutComponent implements OnInit {

  constructor(
    public themeService: ThemeService,
  ) { }

  ngOnInit(): void {
  }

}

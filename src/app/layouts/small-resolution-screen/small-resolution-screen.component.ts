import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-small-resolution-screen',
  templateUrl: './small-resolution-screen.component.html',
  styleUrls: ['./small-resolution-screen.component.scss'],
})
export class SmallResolutionScreenComponent implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themesList = {
    'dark-default': 'Dark Default',
    'dark-test': 'Dark Test',
    'solarized-dark': 'Solarized Dark',
    'light-default': 'Light Default',
    'solarized-light': 'Solarized Light',
    'light-test': 'Light Test',
  };

  theme_mode: string = localStorage.getItem('theme_mode') || 'dark';
  activeTheme: string = localStorage.getItem('activeTheme') || 'dark-default';

  choozenLightTheme: string =
    localStorage.getItem('choozenLightTheme') || 'solarized-light';
  choozenDarkTheme: string =
    localStorage.getItem('choozenDarkTheme') || 'dark-test';

  previewBeforeTheme: string = '';
  hoveredLightTheme: string = localStorage.getItem('choozenLightTheme') || '';
  hoveredDarkTheme: string = localStorage.getItem('choozenDarkTheme') || '';
  themeChanged$ = new BehaviorSubject<boolean>(true);
  constructor() {}

  chooseThemeMode(mode: string): void {
    this.theme_mode = mode;
    localStorage.setItem('theme_mode', mode);

    this.activeTheme =
      mode === 'dark' ? this.choozenDarkTheme : this.choozenLightTheme;

    localStorage.setItem('activeTheme', this.activeTheme);
    this.themeChanged$.next(true);
  }
  chooseLightTheme(theme: string): void {
    this.activeTheme = theme;
    this.choozenLightTheme = theme;
    this.previewBeforeTheme = theme;
    localStorage.setItem('activeTheme', theme);
    localStorage.setItem('choozenLightTheme', theme);
    this.themeChanged$.next(true);
  }
  chooseDarkTheme(theme: string): void {
    this.activeTheme = theme;
    this.choozenDarkTheme = theme;
    this.previewBeforeTheme = theme;
    localStorage.setItem('activeTheme', theme);
    localStorage.setItem('choozenDarkTheme', theme);
    this.themeChanged$.next(true);
  }
  previewDarkShow(theme: string): void {
    this.previewBeforeTheme = this.activeTheme;
    this.activeTheme = theme;
    this.hoveredDarkTheme = theme;
  }
  previewDarkHide(theme: string): void {
    if (theme === this.previewBeforeTheme) {
      return;
    }
    this.activeTheme = this.previewBeforeTheme;
    this.previewBeforeTheme = '';
    this.hoveredDarkTheme = this.choozenDarkTheme;
  }

  previewLightShow(theme: string): void {
    this.previewBeforeTheme = this.activeTheme;
    this.activeTheme = theme;
    this.hoveredLightTheme = theme;
  }
  previewLightHide(theme: string): void {
    if (theme === this.previewBeforeTheme) {
      return;
    }
    this.activeTheme = this.previewBeforeTheme;
    this.previewBeforeTheme = '';
    this.hoveredLightTheme = this.choozenLightTheme;
  }
}

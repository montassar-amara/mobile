import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingBgDarkModeColor',
})
export class RatingBgDarkModeColorPipe implements PipeTransform {
  transform(value: number): string {
    // hex colors with opacity 20%
    const colors = [
      '#DE526833',
      '#E1874533',
      '#E3CB4E33',
      '#72CC8833',
      '#36AEC133',
    ];
    if (value <= 1) return colors[0];
    if (value <= 2) return colors[1];
    if (value <= 3) return colors[2];
    if (value <= 4) return colors[3];
    if (value <= 5) return colors[4];
  }
}

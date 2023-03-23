import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingTextDarkModeColor',
})
export class RatingTextDarkModeColorPipe implements PipeTransform {
  transform(value: number): string {
    const colors = ['#DE5268', '#E18745', '#E3CB4E', '#72CC88', '#36AEC1'];
    if (value <= 1) return colors[0];
    if (value <= 2) return colors[1];
    if (value <= 3) return colors[2];
    if (value <= 4) return colors[3];
    if (value <= 5) return colors[4];
  }
}

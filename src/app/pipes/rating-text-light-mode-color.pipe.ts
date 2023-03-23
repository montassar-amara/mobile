import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingTextLightModeColor',
})
export class RatingTextLightModeColorPipe implements PipeTransform {
  transform(value: number): string {
    const colors = ['#ea1f3d', '#d65200', '#a67607', '#00a529', '#018296'];
    if (value <= 1) return colors[0];
    if (value <= 2) return colors[1];
    if (value <= 3) return colors[2];
    if (value <= 4) return colors[3];
    if (value <= 5) return colors[4];
  }
}

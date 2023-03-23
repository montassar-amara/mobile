import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingBgLightModeColor',
})
export class RatingBgLightModeColorPipe implements PipeTransform {
  transform(value: number): string {
    // hex colors with opacity 50%
    const colors = [
      '#DE526880',
      '#E1874580',
      '#E3CB4E80',
      '#72CC8880',
      '#36AEC180',
    ];
    if (value <= 1) return colors[0];
    if (value <= 2) return colors[1];
    if (value <= 3) return colors[2];
    if (value <= 4) return colors[3];
    if (value <= 5) return colors[4];
  }
}

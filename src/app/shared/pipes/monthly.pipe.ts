import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthly',
})
export class MonthlyPipe implements PipeTransform {
  transform(value: any): any {
    if (value.name_period === 'Yearly') {
      return value.price / 12;
    }
    return value.price / 4;
  }
}

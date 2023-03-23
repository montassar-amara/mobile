import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saving',
})
export class SavingPipe implements PipeTransform {
  transform(value: any, prices: any[]): any {
    if (value.name_period === 'Yearly') {
      const high = prices.find((p) => p.name_period === 'Quarterly');
      return `Save $${high?.price * 4 - value?.price} (~${Math.round((value?.price / (high?.price * 4)) * 100
      )}%)`;
    }
    return '';
  }
}

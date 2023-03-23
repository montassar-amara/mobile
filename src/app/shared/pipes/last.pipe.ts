import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'last'
})
export class LastPipe implements PipeTransform {

  transform(value: any[]): any {
    const len = value.length
    if(len>0){
      return value[len-1]
    }
    return undefined
  }

}

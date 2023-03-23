import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beforeLast'
})
export class BeforeLastPipe implements PipeTransform {

  transform(value: any[]): any {
    const len = value.length
    if(len>1){
      return value[len-2]
    }
    return undefined
  }

}

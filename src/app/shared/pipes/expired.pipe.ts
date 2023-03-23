import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expired'
})
export class ExpiredPipe implements PipeTransform {

  transform(value: number,msg:string,msgExpiring?:string) {
    if(msgExpiring && value<4) return msgExpiring
    if(value>0) return value;
    else return msg
  }

}

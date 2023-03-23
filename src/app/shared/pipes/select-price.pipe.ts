import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectPrice'
})
export class SelectPricePipe implements PipeTransform {

  transform(values: {_id:{$oid:string},name_period:string,price:number}[],periodName): number {
    if(values){
      return values.find(v=>v.name_period===periodName)?.price || 0;
    }else return 0;
  }

}

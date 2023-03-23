import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includedIn'
})
export class IncludesPipe implements PipeTransform {

  transform(value:any, collection: any[],props='_id'): boolean {
    if(collection){
      const res = collection.find(el=>el[props]===value['_id'])
    return res!==undefined;
    }
    return false;
  }

}

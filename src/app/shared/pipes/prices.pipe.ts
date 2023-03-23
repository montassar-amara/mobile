import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from '../services/store.service';

@Pipe({
  name: 'prices'
})
export class PricesPipe implements PipeTransform {
  companies$ = this.storeService.companies$
  constructor(
    private storeService:StoreService
  ){}
  transform(value: any): Observable<any[]> {
    return this.companies$.pipe(map(cmps=>{
      const company = cmps.find(cmp=>cmp._id===value.company_id)
      return company?company.prices:[]
    }));
  }

}

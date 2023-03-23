import { Pipe, PipeTransform } from '@angular/core';
import { ICompany } from '../models/company';
import { ISubscription } from '../models/subscription';

@Pipe({
  name: 'mycompany'
})
export class MycompanyPipe implements PipeTransform {

  transform(value: ICompany,subs:ISubscription,type:string): boolean {
    if(!subs?._id && !subs?.subscriptionIn){
      return false;
    }
    if(subs?._id && subs?.type==='free'){
      return true;
    }
    if(type==='in'){
      return [...subs?.subscriptionIn.map((r:any)=>r.company_id)].includes(value._id);
    }
    if(type==='out'){
      return [...subs?.subscriptionOut.map((r:any)=>r.company_id)].includes(value._id);
    }
    return [...((subs?.is_active && !(subs?.type==='free'))?subs?.subscriptionIn.map((r:any)=>r.company_id):[]),...subs?.subscriptionOut.map((r:any)=>r.company_id)].includes(value?._id);
  }

}

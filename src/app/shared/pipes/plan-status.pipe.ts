import { Pipe, PipeTransform } from '@angular/core';
import { IPlan } from '../models/plan';
import { ISubscription } from '../models/subscription';

@Pipe({
  name: 'planStatus'
})
export class PlanStatusPipe implements PipeTransform {

  transform(plan: IPlan,period:string, subs: ISubscription): 'Upgrade'|'Downgrade'|'Select'|'Current' {
    if(!subs?.plan){
      return 'Select'
    }else{
      const priceOld = subs.plan.prices.find(p=>p.name_period===subs.plan_period_selected)
      const priceNew =plan.prices.find(p=>p.name_period===period)
      return priceNew === priceNew ? 'Current': priceNew>priceOld?'Upgrade':'Downgrade';
    }
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICard } from '../models/card';
import { ICompany } from '../models/company';
import { IPlan } from '../models/plan';
import { ISubscription } from '../models/subscription';



@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(
    private http: HttpClient,
  ) { }

  deleteSubscription(id: any): Observable<any> {
    return this.http.delete<any>(environment.api+`subscriptions/DeleteCompanyOut/`+id, {});
  }

  getSubscription():Observable<ISubscription>{
    return this.http.get<ISubscription>(environment.api+"subscriptions",{})
  }
  updateAutoPayment(value:boolean,sub_id:string,company_id:string){
    return this.http.get<ISubscription>(environment.api+`subscriptions/enabledDisabledAutoPayment/${value}/${sub_id}/${company_id}`,{})
  }
  updateAutoPaymentPlan(){
    return this.http.get<any>(environment.api+`subscriptions/updateAutoPayment`,{})
  }
  // get card list
  getCardList():Observable<ICard[]>{
    return this.http.get<ICard[]>(environment.api+`payments/cards`,{})
  }
  // pay with selected card
  checkoutCompanies():Observable<ICard[]>{
    return this.http.get<ICard[]>(environment.api+`subscriptions`,{})
  }
  // add companies in to sub plan

  // Add new Card
  addNewCard(card:Partial<ICard>){
    return this.http.post(environment.api+`payments/cards/add_card`,card,{})
  }
  getCompanies():Observable<ICompany[]>{
    return this.http.get<ICompany[]>(environment.api+"companies",{});
  }
  getplans():Observable<IPlan[]>{
    return this.http.get<IPlan[]>(environment.api+"plans",{});
  }
  selectPlan(id:string,period:string,cardId:string):Observable<any>{
    const form = new FormData()
    form.append("plan_id",id);
    form.append("period",period);
    form.append("card_id",cardId);
    return this.http.post(environment.api+"payments/paycard",form,{})
  }
  downgradeReactivate(id:string,period:string,cardId:string,cmp_check_plan:string[]):Observable<any>{
    const form = new FormData()
    form.append("plan_id",id);
    form.append("period",period);
    form.append("card_id",cardId);
    cmp_check_plan?.forEach(cmp=>form.append("cmp_check_plan[]",cmp))
    return this.http.post(environment.api+"payments/Reativate/downgrade",form,{})
  }
  addCompaniesInToSub(companiesIn:ICompany[]){
    const form = new FormData()
    companiesIn.forEach(cmp=>form.append("companies_in[]",cmp._id))
    return this.http.post(environment.api+"subscriptions/add_company_in",form,{})
  }
  addCompaniesOutToSubSpecial(companiesIn:ICompany[]){
    const form = new FormData()
    companiesIn.forEach(cmp=>form.append("company_id_out[]",cmp._id))
    return this.http.post(environment.api+"subscriptions/specialsubscription/add_company_out",form,{})
  }
  addCompaniesOutToSub(companiesOut:{cId:string;period:string}[],cardId:string){
    const form = new FormData()
    form.append("card_id",cardId);
    companiesOut.forEach(cmp=>{
      form.append("company_id_out[]",cmp.cId);
      form.append("subscriptions_period[]",cmp.period);
    })
    return this.http.post(environment.api+"payments/paycard",form,{})
  }
  // get payment history
  getPaymentHistory(){
    return this.http.get<any[]>(environment.api+"payments",{})
  }
  setDefaultCard(id:string){
    return this.http.get<string>(environment.api+"payments/cards/setDefault/"+id,{})
  }
  deleteCard(card:ICard){
    return this.http.delete<string>(environment.api+"payments/cards/delete/"+card._id,{})
  }
  updateSubscriptionsPeriod(id:string,period:string){
    return this.http.get<string>(environment.api+`subscriptions/updateSubscriptionsPeriod/${period}/${id}`,{})
  }
  updateSubscriptionsAutopayment(id:string,state:boolean){
    return this.http.get<string>(environment.api+`subscriptions/enabledDisabledAutoPayment/${state}/${id}`,{})
  }
  downgradePlan(toRemove:{company_id:string}[],pid:string ,period:string){
    const form = new FormData()
    form.append("new_period",period);
    form.append("new_plan_id",pid);
    toRemove.forEach(cmp=>{
      form.append("cmp_check_plan[]",cmp.company_id);
    })
    return this.http.post(environment.api+"payments/downgrade",form,{})
  }
  getDiffAmount(period:string,newPlan:IPlan){
    return this.http.get<any>(environment.api+`payments/upgrade/getdiffamount/${newPlan._id}/${period}`,{})
  }
  upgradePlan(pid:string,cardId:string){
    const form = new FormData()
    form.append("card_id",cardId);
    form.append("new_plan_id",pid);
    return this.http.post(environment.api+"payments/upgrade/PayUpgradePlan",form,{})
  }
  tradeIn(id:string){
    return this.http.get<any>(environment.api+`subscriptions/trade_in/${id}`,{})
  }
  updatePeriodSubscription(period:string){
    return this.http.get<any>(environment.api+`subscriptions/updatePeriod/${period}`,{})
  }
  subscriptionFreeCompany(id:string){
    return this.http.get<any>(environment.api+`subscriptions/testingCompanySubscription/${id}`,{})
  }
  addspecialsubscription(id:string){
    const form = new FormData()
    form.append("card_id",id)
    return this.http.post<any>(environment.api+`subscriptions/addspecialsubscription`,form)
  }
  addMasterPlan(id:string){
    return this.http.get<any>(environment.api+`subscriptions/AddAdminFreeSubscription/${id}`,{})
  }
  deleteMasterPlan(id:string){
    return this.http.delete<any>(environment.api+`subscriptions/deleteAdminFreeSubscription/${id}`,{})
  }
}

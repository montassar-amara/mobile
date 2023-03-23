import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ICard } from 'src/app/shared/models/card';
import { ICompany } from 'src/app/shared/models/company';
import { ISubscription } from 'src/app/shared/models/subscription';
import { StoreService } from 'src/app/shared/services/store.service';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { Notifier } from 'src/app/shared/store/states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-company-scenario',
  templateUrl: './select-company-scenario.component.html',
  styleUrls: ['./select-company-scenario.component.scss']
})
export class SelectCompanyScenarioComponent implements OnInit {
  @Input() start: Observable<any>
  @Input() subscription: ISubscription;
  @Input() selectedCompanies:BehaviorSubject<ICompany[]>
  destroy$ = new Subject()
  notifier$ = this.storeService.notifier$
  companiesIn = []
  companiesOut = []
  showConfirmModal = false;
  showWarningNoPlan = false;
  showPaymentDetailModal = false;
  showPaymentMethodModal = false;
  showPaymentSuccessModal = false;
  companiesPlaceholder = []
  dragIndex:number = undefined
  dragSource:string=undefined
  startSelectPlan$ = new BehaviorSubject<boolean>(false)
  startSelectNewPlan$ = new BehaviorSubject<boolean>(false)
  plans$ = this.storeService.plans$;
  filepath = environment.filepath
  constructor(
    private storeService: StoreService,
    private subscriptionService: SubscriptionsService
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.cleanUp()
  }
  ngOnInit(): void {
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe(notif=>{
      switch (notif) {
        case Notifier.SubscriptionAddOutSpecialSuccessful:
        case Notifier.SubscriptionAddOutSuccessful:
        case Notifier.SubscriptionAddInSuccessful:
          this.showConfirmModal = false;
          this.showPaymentDetailModal = false;
          this.showPaymentMethodModal = false;
          this.companiesPlaceholder = this.selectedCompanies.getValue()
          this.showPaymentSuccessModal = true;
          this.selectedCompanies.next([])
          break;

        default:
          break;
      }
    })
    if (this.start) {
      this.start.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.distributeCompanies()
      })
    }
  }
  distributeCompanies() {
    const subs = this.subscription;
    if(this.subscription?.type==='launch'){
      this.companiesIn = this.selectedCompanies.getValue().map((c) => ({ company: c, period: c.prices[0] }))
      this.showWarningNoPlan = false;
    }else{
      const left =
      subs?._id && subs?.plan
        ? subs.plan.number_companies - subs.subscriptionIn.length
        : -1;
    if (left > 0 && this.subscription?.is_active) {
      this.companiesIn =
        this.selectedCompanies.getValue().slice(0, left).map((c) => ({ company: c, period: c.prices[0] }));
      this.companiesOut =
        this.selectedCompanies.getValue().slice(left).map((c) => ({ company: c, period: c.prices[0] }))
    } else {
      this.companiesIn = []
      this.companiesOut = this.selectedCompanies.getValue().map((c) => ({ company: c, period: c.prices[0] }))
    }
    this.showWarningNoPlan = (left === -1) || !this.subscription?.is_active;
  }
  this.showConfirmModal = true;
  }
  cleanUp() {
  }
  confirmSelection() {
    if(this.subscription?.type==='launch'){
      this.storeService.addCompaniesOutToSubSpecial(this.companiesIn.map(cmp=>cmp.company))
    }else{
      if(this.companiesOut.length===0 && this.companiesIn.length>0 && this.companiesIn.length<= (this.subscription.plan.number_companies-this.subscription.subscriptionIn.length)){
        this.storeService.addCompaniesInToSub(this.companiesIn.map(cmp=>cmp.company))
      }else if(this.companiesOut.length>0){
        this.showPaymentDetailModal = true;
        this.showConfirmModal = false;
      }
    }
  }
  removeItem(index: number, out = true) {
    const x = out ? this.companiesOut.splice(index, 1) : this.companiesIn.splice(index, 1);
    const tmp = this.selectedCompanies.getValue()
    tmp.splice(tmp.indexOf(x[0]), 1)
    this.selectedCompanies.next(tmp)
    if (
      this.companiesIn.length + this.companiesOut.length === 0
    ) {
      this.showConfirmModal = false;
    }
  }
  periodChange(
    index: number,
    item: {
      company: ICompany;
      period: { _id: { $oid: string }; name_period: string; price: number };
    },
  ) {
    const idx = this.companiesOut.findIndex((v) => v.company._id === item.company._id);
    if (idx >= 0) {
      this.companiesOut[idx].period = this.companiesOut[idx].company.prices[index];
    }
  }
  sum(){
    return this.companiesOut.reduce((acc, v) => acc + Number(v.period.price), 0)
  }
  selectPaymentMethod() {
    this.showPaymentDetailModal = false;
    this.showPaymentMethodModal = true;
  }
  processPayment(event: ICard | string) {
    if (typeof event === 'string') {
      // pay with paypal
    } else {
      this.storeService.SubscriptionAddCompaniesOut(this.companiesOut.map((cmp) => ({
        cId: cmp.company._id,
        period: cmp.period.name_period,
      })),this.companiesIn.map(cmp=>cmp.company),event._id,)
    }
  }
  openUpdatePlan(){
    this.startSelectNewPlan$.next(true)
  }
  enoughSlots(){
    if (this.subscription && this.subscription.subscriptionIn && this.subscription.plan_id) {
      return (this.subscription.plan.number_companies - this.subscription.subscriptionIn.length - this.companiesIn.length)>0
    }
    return false
  }
  onDragStart(index:number,collection:string){
    this.dragIndex = index
    this.dragSource = collection
  }
  onDragEnd(index:number,collection:string){
    if(this.dragIndex!==undefined && this.dragSource!==undefined){
      if(collection===this.dragSource && index!==this.dragIndex){
        const tmp = this[collection][this.dragIndex]
        this[collection][this.dragIndex] = this[collection][index]
        this[collection][index] = tmp
      }else if(collection!==this.dragSource && (this.enoughSlots() || collection==='companiesOut')){
        const moving = this[this.dragSource].splice(this.dragIndex,1)[0]
        this[collection].splice(index,0,moving)
      }
    }
    this.dragIndex = undefined;
    this.dragSource = undefined;
  }
  cleanup(){
    this.selectedCompanies.next([])
  }
}

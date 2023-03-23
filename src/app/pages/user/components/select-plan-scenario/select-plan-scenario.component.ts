import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  Observable,
  Subject,
} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ICard } from 'src/app/shared/models/card';
import { IPlan } from 'src/app/shared/models/plan';
import { ISubscription } from 'src/app/shared/models/subscription';
import { StoreService } from 'src/app/shared/services/store.service';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-select-plan-scenario',
  templateUrl: './select-plan-scenario.component.html',
  styleUrls: ['./select-plan-scenario.component.scss'],
})
export class SelectPlanScenarioComponent implements OnInit, OnDestroy {
  showSelectPlanModal = false;
  // showPaymentDetailPlanModal = false;
  showPaymentMethodModal = false;
  showPaymentDetailModal = false;
  ShowPaymentDetailUpgradeModal = false;
  ShowPaymentDetailDowngradeModal = false;
  showPaymentSuccessModal = false;
  ShowPlanChangeSuccessModal = false;
  ShowPlanDowngradeConfirmModal = false;
  @Input() start: Observable<any>;
  @Input() plans: IPlan[];
  @Input() subscription!: ISubscription;
  destroy$ = new Subject();
  selectedPlan$ = new BehaviorSubject<IPlan>(undefined);
  planPeriod$ = new BehaviorSubject<string>('Quarterly');
  planType: 'Select' | 'Upgrade' | 'Downgrade' = 'Select';
  diff$ = new BehaviorSubject<number>(0)
  total$ = combineLatest([this.selectedPlan$, this.planPeriod$,this.diff$]).pipe(
    map(([plan, planPeriod,diff]) =>
      diff!==0 ? diff: (plan
      ? plan.prices.find((price) => price.name_period === planPeriod)?.price
      : 0)
    )
  );
  notifier$ = this.storeService.notifier$;
  toRemove: any[] = [];
  toKeep: any[] = [];
  diff!: any;
  dragIndex: number = undefined;
  dragSource: string = undefined;

  isAnnually: boolean = false;
  constructor(
    private storeService: StoreService,
    private subscriptionservice: SubscriptionsService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.cleanUp();
  }

  ngOnInit(): void {
    if (this.subscription?.plan_id) {
      this.planPeriod$.next(this.subscription.plan_period_selected);
    }

    if (this.start) {
      this.start.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.planPeriod$.next(this.subscription?.plan_period_selected ?? 'Quarterly')
        this.showSelectPlanModal = true;
      });
    }
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe((notification) => {
      switch (notification) {
        case Notifier.SubscriptionUpgradePlanSuccessful:
        case Notifier.SubscriptionSelectPlanSuccessful:
        case Notifier.SubscriptionDowngradePlanSuccessful:
          this.cleanUp();
          break;

        default:
          break;
      }
    });
  }
  cleanUp() {
    this.planPeriod$.next('Yearly');
    this.selectedPlan$.next(undefined);
    this.showSelectPlanModal = false;
    this.showPaymentMethodModal = false;
    this.showPaymentDetailModal = false;
    this.showPaymentSuccessModal = true;
    this.ShowPlanDowngradeConfirmModal = false;
    this.ShowPaymentDetailDowngradeModal = false;
    this.toKeep = [];
    this.toRemove = [];
  }
  async selectPlan(plan: { p: IPlan; type: any }) {
    this.selectedPlan$.next(plan.p);
    this.showSelectPlanModal = false;
    this.planType = plan.type;
    if (
      this.planType === 'Upgrade' &&
      plan.p._id !== this.subscription?.plan_id
    ) {
      this.diff = await this.fetchDiff(plan.p);
      this.ShowPaymentDetailUpgradeModal = true;
    } else if (
      this.planType === 'Select' ||
      plan.p._id === this.subscription?.plan_id
    ) {
      this.showPaymentDetailModal = true;
    } else {
      if (
        this.subscription?.subscriptionIn.length >
        this.selectedPlan$.getValue().number_companies
      ) {
        this.ShowPaymentDetailDowngradeModal = true;
        this.toKeep = this.subscription?.subscriptionIn;
      } else {
        if (this.subscription?.is_active) {
          this.ShowPlanDowngradeConfirmModal = true;
        } else {
          this.showPaymentDetailModal = true;
        }
      }
    }
  }
  processPayment(event: ICard | string) {
    if (typeof event === 'string') {
      // pay with paypal
    } else {
      if (this.planType === 'Upgrade') {
        this.storeService.subscriptionUpgradePlan(
          this.selectedPlan$.getValue()._id,
          event._id
        );
      } else if (this.planType === 'Select') {
        this.storeService.subscriptionSelectPlan(
          this.selectedPlan$.getValue()._id,
          this.planPeriod$.getValue(),
          event._id
        );
      } else if (this.planType === 'Downgrade') {
        this.storeService.downgradeReactivate(
          this.selectedPlan$.getValue()._id,
          this.planPeriod$.getValue(),
          event._id,
          this.toRemove.map((c) => c.company_id)
        );
      }
    }
  }
  selectPaymentMethod() {
    this.showPaymentDetailModal = false;
    this.showPaymentMethodModal = true;
  }
  onUpgradeConfirm(e: string) {
    this.diff$.next(this.diff.amount_pay/1.25)
    this.ShowPaymentDetailUpgradeModal = false;
    this.showPaymentMethodModal = true;
  }
  async fetchDiff(plan: any) {
    return await lastValueFrom(
      this.subscriptionservice.getDiffAmount(this.planPeriod$.getValue(), plan)
    );
  }
  confirmDowngrade() {
    this.storeService.downgradePlan(
      this.toRemove,
      this.selectedPlan$.getValue()._id,
      this.planPeriod$.getValue()
    );
  }
  confirmDowngradeSelection() {
    if (this.left() >= 0) {
      if (this.subscription?.is_active) {
        this.storeService.downgradePlan(
          this.toRemove,
          this.selectedPlan$.getValue()._id,
          this.planPeriod$.getValue()
        );
      } else {
        this.ShowPaymentDetailDowngradeModal = false;
        this.showPaymentDetailModal = true;
      }
    }
  }
  onDragStart(index: number, collection: string) {
    this.dragIndex = index;
    this.dragSource = collection;
  }
  left() {
    return this.selectedPlan$.getValue().number_companies - this.toKeep.length;
  }
  onDragEnd(index: number, collection: string) {
    if (this.dragIndex !== undefined && this.dragSource !== undefined) {
      if (collection === this.dragSource && index !== this.dragIndex) {
        const tmp = this[collection][this.dragIndex];
        this[collection][this.dragIndex] = this[collection][index];
        this[collection][index] = tmp;
      } else if (
        collection !== this.dragSource &&
        (this.left() >= 0 || collection === 'toRemove')
      ) {
        const tmp = [...this[this.dragSource]];
        const moving = tmp.splice(this.dragIndex, 1)[0];
        this[this.dragSource] = tmp;
        this[collection] = [...this[collection], moving];
      }
    }
    this.dragIndex = undefined;
    this.dragSource = undefined;
  }
}

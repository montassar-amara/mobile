import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ICard } from 'src/app/shared/models/card';
import { IPlan } from 'src/app/shared/models/plan';
import { ISubscription } from 'src/app/shared/models/subscription';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';
import { SeePlansService } from 'src/app/shared/styling_services/see-plans.service';

@Component({
  selector: 'app-select-new-plan-scenario',
  templateUrl: './select-new-plan-scenario.component.html',
  styleUrls: ['./select-new-plan-scenario.component.scss'],
})
export class SelectNewPlanScenarioComponent implements OnInit, OnDestroy {
  showSelectPlanModal = true;
  // showPaymentDetailPlanModal = false;
  showPaymentMethodModal = false;
  showPaymentDetailModal = false;
  showPaymentSuccessModal = false;
  @Input() start: BehaviorSubject<boolean>;
  @Input() plans: IPlan[];
  @Input() subscription!: ISubscription;
  destroy$ = new Subject();
  selectedPlan$ = new BehaviorSubject<IPlan>(undefined);
  planPeriod$ = new BehaviorSubject<string>('Quarterly');
  planType: 'Select' | 'Upgrade' | 'Downgrade' = 'Select';
  diff$ = new BehaviorSubject<number>(0);
  total$ = combineLatest([
    this.selectedPlan$,
    this.planPeriod$,
    this.diff$,
  ]).pipe(
    map(([plan, planPeriod, diff]) =>
      diff !== 0
        ? diff
        : plan
        ? plan.prices.find((price) => price.name_period === planPeriod)?.price
        : 0
    )
  );
  notifier$ = this.storeService.notifier$;

  isAnnually: boolean = false;
  constructor(
    private storeService: StoreService,
    public plansPopup: SeePlansService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.cleanUp();
  }
  cancelSubs() {
    this.start.next(false);
    this.plansPopup.selectPlanModal = false;
  }
  ngOnInit(): void {
    if (this.subscription?.plan_id) {
      this.planPeriod$.next(this.subscription.plan_period_selected);
    }

    if (this.start) {
      this.start.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.planPeriod$.next(
          this.subscription?.plan_period_selected ?? 'Quarterly'
        );
        // this.showSelectPlanModal = true;
        this.plansPopup.selectPlanModal = true;
      });
    }
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe((notification) => {
      switch (notification) {
        case Notifier.SubscriptionSelectPlanSuccessful:
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
    // this.showSelectPlanModal = false;
    this.plansPopup.selectPlanModal = false;
    this.showPaymentMethodModal = false;
    this.showPaymentDetailModal = false;
    this.showPaymentSuccessModal = true;
  }
  async selectPlan() {
    this.selectedPlan$.next(this.plans as any as IPlan);
    // this.showSelectPlanModal = false;
    this.showPaymentDetailModal = true;
    this.plansPopup.selectPlanModal = false;
  }
  processPayment(event: ICard | string) {
    if (typeof event === 'string') {
      // pay with paypal
    } else {
      this.storeService.subscriptionSelectPlan(
        this.selectedPlan$.getValue()._id,
        this.planPeriod$.getValue(),
        event._id
      );
    }
  }
  selectPaymentMethod() {
    this.showPaymentDetailModal = false;
    this.showPaymentMethodModal = true;
  }
}

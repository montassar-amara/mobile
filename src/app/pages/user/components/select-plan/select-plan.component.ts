import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlan } from 'src/app/shared/models/plan';
import { StoreService } from 'src/app/shared/services/store.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss'],
})
export class SelectPlanComponent implements OnInit {
  plans$ = this.storeSerice.plans$;
  subs$ = this.storeSerice.subscription$;
  user$ = this.storeSerice.user$;
  currentPlanIndex$ = combineLatest([this.plans$, this.subs$]).pipe(
    map(
      ([plans, subs]) =>
        plans.findIndex((plan) => plan._id === subs?.plan_id) + 3
    )
  );
  @Output() close = new EventEmitter();
  @Output() select = new EventEmitter();
  @Input() planPeriod$!: BehaviorSubject<string>;
  plans: IPlan[] = [];
  notAvailable03: boolean = true;
  constructor(
    private storeSerice: StoreService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.plans$.subscribe((res) => (this.plans = res));
  }
  selectPlan(pindex: number, currentIndex: number) {
    const type =
      currentIndex === -1 || currentIndex === pindex
        ? 'Select'
        : pindex < currentIndex
        ? 'Downgrade'
        : 'Upgrade';
    this.select.emit({ p: this.plans[pindex], type });
  }
  signUp(){
    this.close.emit()
    this.router.navigate(['auth/register'])
  }
}

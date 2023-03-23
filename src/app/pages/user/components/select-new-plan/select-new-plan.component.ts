import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlan } from 'src/app/shared/models/plan';
import { StoreService } from 'src/app/shared/services/store.service';
import { SeePlansService } from 'src/app/shared/styling_services/see-plans.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-select-new-plan',
  templateUrl: './select-new-plan.component.html',
  styleUrls: ['./select-new-plan.component.scss'],
})
export class SelectNewPlanComponent implements OnInit {
  plans$ = this.storeSerice.plans$;
  subs$ = this.storeSerice.subscription$;
  user$ = this.storeSerice.user$;
  @Output() close = new EventEmitter();
  @Output() select = new EventEmitter();
  @Input() planPeriod$!: BehaviorSubject<string>;
  plans: IPlan[] = [];
  notAvailable03: boolean = true;
  constructor(
    private storeSerice: StoreService,
    public themeService: ThemeService,
    private router: Router,
    public plansPopup: SeePlansService
  ) {}

  ngOnInit(): void {
    this.plans$.subscribe((res) => (this.plans = res));
  }
  selectPlan() {
    this.select.emit();
  }
  signUp() {
    this.close.emit();
    this.router.navigate(['auth/register']);
  }
}

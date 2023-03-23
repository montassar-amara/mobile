
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICompany } from 'src/app/shared/models/company';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-list-item',
  templateUrl: './company-list-item.component.html',
  styleUrls: ['./company-list-item.component.scss'],
})
export class CompanyListItemComponent implements OnInit {
  @Input() company: any;
  cmp!:ICompany;
  @Input() isDowngrade = false;
  @Output() remove = new EventEmitter();
  @Input() display: 'in' | 'out' = 'out';
  @Output() periodChange = new EventEmitter();
  selectedPeriod$ = new BehaviorSubject<{ name_period: string; price: number }>(
    { name_period: '', price: 0 }
  );
  filepath = environment.filepath
  
  constructor() {}

  ngOnInit(): void {
    if (this.company.company) {
      this.selectedPeriod$.next(this.company.company.prices[0]);
    }
  }
  removeItem() {
    this.remove.emit();
  }
  changeSelection(i: number) {
    this.selectedPeriod$.next(this.company.company.prices[i]);
    this.periodChange.emit(i);
  }
  // changeSelection(e: Event) {
  //   this.selectedPeriod$.next(
  //     this.company.company.prices[(e.target as HTMLSelectElement).value]
  //   );
  //   this.periodChange.emit((e.target as HTMLSelectElement).value);
  // }
}

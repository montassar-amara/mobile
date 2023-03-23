import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { ICompany } from 'src/app/shared/models/company';
import {IRating, ITab} from 'src/app/shared/models/sectors';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';
import { environment } from 'src/environments/environment';
import {CompanyService} from "../../../../shared/services/company.service";

@Component({
  selector: 'app-sector-overview',
  templateUrl: './sector-overview.component.html',
  styleUrls: ['./sector-overview.component.scss'],
})
export class SectorOverviewComponent implements OnInit {
  @Input() sector!: {
    _id: string;
    name: string;
    companies: ICompany[];
    ratings: IRating[];
  };
  // tabs = ['Value','FY Trailing Estimates','Rating']
  tabs = [];
  columns = [];
  selectedTab!: ITab;

  column_values = [];

  filepath = environment.filepath;
  selectedValue = 'Absolute';
  values = ['Absolute', 'Per Share'];
  showRatingModal = false;
  constructor(
    private companyService: CompanyService,
    private cd: ChangeDetectorRef,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.selectedTab = undefined;

    this.fetchTabs();
  }

  onSelectTab() {
    this.fetchColumnValues();
  }

  fetchTabs() {
    this.companyService.fetchTabs(this.sector._id).subscribe((res) => {
      this.tabs = res;
      if (res.length > 0) {
        this.selectedTab = this.tabs[0];
        this.fetchColumnValues();
      }
    });
  }

  fetchColumns() {
    this.companyService.fetchColumns(this.selectedTab._id).subscribe((res) => {
      this.columns = res;
    });
  }

  fetchColumnValues() {
    this.companyService
      .fetchColumnValues(this.selectedTab._id)
      .subscribe((res) => {
        this.column_values = res;

        this.cd.detectChanges();
        this.fetchColumns();
      });
  }

  getColumnValue(column_id, company_id) {
    for (let i = 0; i < this.column_values.length; i++) {
      const column_value = this.column_values[i];

      if (
        column_value.sector_column_id == column_id &&
        column_value.sector_company_id == company_id
      ) {
        return column_value.value;
      }
    }

    return '';
  }
}

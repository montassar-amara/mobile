import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ICompany, NamePeriod} from 'src/app/shared/models/company';
import {IColumn, IEstimation, IRating, ISector, ITab} from 'src/app/shared/models/sectors';
import { CompanyService } from 'src/app/shared/services/company.service';
import { environment } from 'src/environments/environment';
import _default from "chart.js/dist/core/core.interaction";
import x = _default.modes.x;

@Component({
  selector: 'app-manager-header',
  templateUrl: './manager-header.component.html',
  styleUrls: ['./manager-header.component.scss'],
})
export class ManagerHeaderComponent implements OnInit {
  showSectorModal = false;
  showRatingModal = false;
  showPricesModal = false;
  showValuationModal = false;
  showColumnsModal = false;
  sectors = [];
  ratings = [];
  prices = [];
  valuations = [];
  sector_tabs = [];
  sector_columns = [];
  sector_companies = []
  selectedSector: ISector = undefined;
  newSector: Partial<ISector> = undefined;
  selectedRating: IRating = undefined;
  selected_sector_tab: ITab = undefined;
  new_sector_tab: Partial<ITab> = undefined;
  selected_sector_column: IColumn = undefined;
  new_sector_column: Partial<IColumn> = undefined;
  selected_sector_company: ICompany = undefined;
  sector_column_value = undefined;

  column_values = []
  grid_values = []

  newRating: Partial<IRating> = undefined;
  filepath = environment.filepath;
  pickedImage: File = undefined;
  newValue = undefined;
  pricesForm = this.fb.group({
    yearly: [''],
    quarterly: [''],
  });
  @Output() onPortfolio = new EventEmitter()
  @Output() onBlogs = new EventEmitter()
  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.companyService.fetchPrices().subscribe((res) => {
      this.prices = res;
      this.pricesForm.controls['quarterly'].setValue(
        `${res.find((p) => p.name_period === NamePeriod.QUARTERLY)?.price ?? 0}`
      );
      this.pricesForm.controls['yearly']?.setValue(
        `${res.find((p) => p.name_period === NamePeriod.YEARLY)?.price ?? 0}`
      );
    });
    this.companyService.fetchSectors().subscribe((res) => (this.sectors = res));
    this.companyService.fetchRatings().subscribe((res) => (this.ratings = res));
    this.companyService
      .fetchValuation()
      .subscribe((res) => (this.valuations = res));
  }

  fetchSectorCompanies(sector_id) {
    this.companyService
      .fetchSectorCompanies(sector_id)
      .subscribe((res) => {
        this.sector_companies = res;
      })
  }

  fetchTabs(sector_id) {
    this.companyService
      .fetchTabs(sector_id)
      .subscribe((res) => {
        this.sector_tabs = res;
      })
  }

  fetchColumns(tab_id) {
    this.companyService
      .fetchColumns(tab_id)
      .subscribe((res) => {
        this.sector_columns = res;
        this.initGridValues();
        this.fetchColumnValues(tab_id)
      })
  }

  fetchColumnValues(tab_id) {
    this.companyService
      .fetchColumnValues(tab_id)
      .subscribe(res => {
        this.column_values = res
        this.updateGridValues()
      })
  }

  initGridValues() {
    this.grid_values = []
    for (let i = 0; i < this.sector_companies.length; i++) {
      let gv_i = []
      for (let j = 0; j < this.sector_columns.length; j++) {
        gv_i = [...gv_i, '']
      }

      this.grid_values = [...this.grid_values, gv_i]
    }
  }

  updateGridValues() {
    this.column_values.map(column_value => {
      let i1 = -1
      for (i1 = 0; i1 < this.sector_companies.length; i1++) {
        if (this.sector_companies[i1]._id == column_value.sector_company_id) {
          break
        }
      }

      let i2 = -1
      for (i2 = 0; i2 < this.sector_columns.length; i2++) {
        if (this.sector_columns[i2]._id == column_value.sector_column_id) {
          break
        }
      }

      if (i1 != -1 && i2 != -1) {
        this.grid_values[i1][i2] = column_value.value
      }
    })


  }

  updateColumnValues() {
    let _column_values = []

    for (let i = 0; i < this.sector_companies.length; i++) {
      for (let j = 0; j < this.sector_columns.length; j++) {
          let _column_value = {
            sector_company_id: this.sector_companies[i]._id,
            sector_column_id: this.sector_columns[j]._id,
            value: this.grid_values[i][j]
          }

          _column_values = [..._column_values, _column_value]
      }
    }

    const payload = {
      column_value_list: _column_values
    }

    this.companyService
      .saveColumnValues(payload)
      .subscribe((res) => {
      })

  }


  save() {
    this.companyService.addSector(this.newSector).subscribe(() => {
      this.companyService
        .fetchSectors()
        .subscribe((res) => (this.sectors = res));
      this.newSector = undefined;
    });
  }
  update() {
    this.companyService.updateSector(this.selectedSector).subscribe(() => {
      this.companyService
        .fetchSectors()
        .subscribe((res) => (this.sectors = res));
      this.selectedSector = undefined;
    });
  }
  addNewSector() {
    this.selectedSector = undefined;
    this.newSector = { name: '', ratings: [] };
  }
  selectSector(sector: ISector) {
    this.newSector = undefined;
    this.selectedSector = sector;

    this.selected_sector_tab = undefined;
    this.new_sector_tab = undefined;

    this.fetchTabs(sector._id);
    this.fetchSectorCompanies(sector._id);
  }

  addNewSectorTab() {
    this.selected_sector_tab = undefined;
    this.new_sector_tab = { name: '', sector_id: this.selectedSector._id };
  }

  selectSectorTab(sector_tab: ITab) {
    this.new_sector_tab = undefined;
    this.selected_sector_tab = sector_tab;

    this.fetchColumns(this.selected_sector_tab._id)
  }

  updateSectorTab() {
    this.companyService
      .updateTab(this.selected_sector_tab).subscribe((res) => {
        this.fetchTabs(this.selectedSector._id)
      })
  }

  deleteSectorTab() {
    this.companyService
      .deleteTab(this.selected_sector_tab)
      .subscribe((res) => {
        this.fetchTabs(this.selectedSector._id)
      })
  }

  saveSectorTab() {
    this.companyService
      .addTab(this.new_sector_tab).subscribe((res) => {
        this.fetchTabs(this.selectedSector._id)
    })
  }

  addNewSectorColumn() {
    this.selected_sector_column = undefined;
    this.new_sector_column = { name: '', sector_tab_id: this.selected_sector_tab._id };
  }

  selectSectorColumn(sector_column: IColumn) {
    this.new_sector_column = undefined;
    this.selected_sector_column = sector_column;

    this.selected_sector_company = undefined;
    this.sector_column_value = undefined;
  }

  updateSectorColumn() {
    this.companyService
      .updateColumn(this.selected_sector_column).subscribe((res) => {
      this.fetchColumns(this.selected_sector_tab._id)
    })
  }

  deleteSectorColumn() {
    this.companyService
      .deleteColumn(this.selected_sector_column)
      .subscribe((res) => {
        this.fetchColumns(this.selected_sector_tab._id)
      })
  }

  saveSectorColumn() {
    this.companyService
      .addColumn(this.new_sector_column).subscribe((res) => {
      this.fetchColumns(this.selected_sector_tab._id)
    })
  }

  selectSectorCompany(sector_company: ICompany) {
    this.selected_sector_company = sector_company;

    const payload = {
      sector_column_id: this.selected_sector_column._id,
      sector_company_id: this.selected_sector_company._id
    }

    this.companyService
      .fetchColumnValue(payload)
      .subscribe(res => {
        this.sector_column_value = res;

        if (!this.sector_column_value.hasOwnProperty('sector_column_id')) {
          this.sector_column_value.sector_column_id = this.selected_sector_column._id;
          this.sector_column_value.sector_company_id = this.selected_sector_company._id;
          this.sector_column_value.value = '';
        }
      })
  }

  saveSectorCompanyValue() {
    this.companyService
      .saveColumnValue(this.sector_column_value)
      .subscribe(res => {
      })
  }

  selectRating(rating: IRating) {
    this.selectedRating = rating;
  }
  updateSector(sector: ISector, rating: IRating, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      sector.ratings.push(rating);
    } else {
      const index = sector.ratings.findIndex((r) => r._id === rating._id);
      if (index >= 0) {
        sector.ratings.splice(index, 1);
      }
    }
  }
  updateSectorEst(sector: ISector, estimation: IEstimation, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      sector.estimations.push(estimation);
    } else {
      const index = sector.estimations.findIndex(
        (r) => r._id === estimation._id
      );
      if (index >= 0) {
        sector.estimations.splice(index, 1);
      }
    }
  }
  delete() {
    this.companyService.deleteSector(this.selectedSector._id).subscribe(() => {
      this.companyService
        .fetchSectors()
        .subscribe((res) => (this.sectors = res));
      this.selectedSector = undefined;
    });
  }
  deleteRating() {
    this.companyService.deleteRating(this.selectedRating._id).subscribe(() => {
      this.companyService
        .fetchRatings()
        .subscribe((res) => (this.ratings = res));
      this.selectedRating = undefined;
    });
  }
  addNewRating() {
    this.selectedRating = undefined;
    this.newRating = { name: '', logo: '' };
  }
  updateRating() {
    this.companyService
      .updateRating(this.selectedRating, this.pickedImage)
      .subscribe(() => {
        this.companyService
          .fetchRatings()
          .subscribe((res) => (this.ratings = res));
        this.selectedRating = undefined;
      });
  }
  pickImage(e: Event) {
    const input = e.target as HTMLInputElement;
    this.pickedImage = input.files[0];
  }
  saveRating() {
    this.companyService
      .addRating(this.newRating, this.pickedImage)
      .subscribe(() => {
        this.companyService
          .fetchRatings()
          .subscribe((res) => (this.ratings = res));
        this.newRating = undefined;
        this.pickedImage = undefined;
      });
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  dismiss() {
    this.selectedRating = undefined;
    this.selectedSector = undefined;
    this.pickedImage = undefined;
    this.newRating = undefined;
    this.newSector = undefined;
    this.newValue = undefined;
    this.new_sector_tab = undefined;
    this.selected_sector_tab = undefined;
    this.new_sector_column = undefined;
    this.selected_sector_column = undefined;
    this.selected_sector_company = undefined;
    this.sector_columns = undefined;
  }
  savePrices() {
    const form = new FormData();
    form.append('price[]', this.pricesForm.value['quarterly']);
    form.append('price[]', this.pricesForm.value['yearly']);
    form.append('name_period[]', 'Quarterly');
    form.append('name_period[]', 'Yearly');

    this.companyService.savePrices(form).subscribe();
  }
}

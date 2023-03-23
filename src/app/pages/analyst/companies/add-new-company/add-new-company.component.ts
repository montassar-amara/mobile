import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICompany } from 'src/app/shared/models/company';
import { CompanyService } from 'src/app/shared/services/company.service';
import { ISector } from 'src/app/shared/models/sectors';
import { IUser } from 'src/app/shared/models/user';
import { lastValueFrom } from 'rxjs';

let jsonToSave: any = null;

@Component({
  selector: 'app-add-new-company',
  templateUrl: './add-new-company.component.html',
  styleUrls: ['./add-new-company.component.scss'],
})
export class AddNewCompanyComponent implements OnInit, AfterViewInit {
  @Input() company: Partial<ICompany> ={}
  FilesForm!: FormGroup;
  step: number = 1;
  savedCompany: any;
  hostStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    float: 'left',
  };
  importExcelFile: any;
  importExcelFile2: any;
  selectedSector: any = undefined;
  selectedLogo: File = null;
  selectedPDF: File = null;
  sectors: ISector[] = [];
  ratings: any[] = [];
  estimations: any[] = [];
  analysts: IUser[] = [];
  selectedAnalyst: IUser = undefined;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.FilesForm = this.fb.group({
      excel_historical_versions: new FormControl([]),
      excel_valuation_versions: new FormControl([]),
    });
  }
  ngAfterViewInit(): void {
    setTimeout(async () => {
      this.analysts = await lastValueFrom(this.companyService.getAnalyst());
      this.sectors = await lastValueFrom(this.companyService.fetchSectors());
      if (this.company._id) {
        this.fetchSectors();
        this.selectedAnalyst = this.analysts.find(
          (a) => a._id === this.company.analyst_id
        );
        this.ratings = this.company.ratings.map((rating) => ({
          value: rating.value,
          rate_id: rating._id,
          name: rating.name,
        }));
      }
    }, 100);
  }
  ngOnInit(): void {}



  onFileSelected(event) {
    this.selectedLogo = <File>event.target.files[0];
  }
  createCompany() {
    const fd = new FormData();
    if (this.selectedLogo)
      fd.append('image', this.selectedLogo, this.selectedLogo.name);
    if (this.selectedPDF)
      fd.append('filepdf', this.selectedPDF, this.selectedPDF.name);
    fd.append('name', this.company.name);
    if (this.selectedSector) fd.append('sector_id', this.selectedSector._id);
    fd.append('capital', `${this.company.capital}`);
    fd.append('equity', `${this.company.equity}`);
    fd.append('overalRating', `${this.company.overalRating}`);
    fd.append('rates', JSON.stringify(this.ratings));
    fd.append('color', this.company.color);
    fd.append('is_free', `${this.company.is_free}`);
    fd.append('tag_name', `${this.company.tag_name}`);
    fd.append('tag_link', `${this.company.tag_link}`);
    fd.append('meta_description', `${this.company.meta_description}`);
    if (this.selectedAnalyst) fd.append('analyst_id', this.selectedAnalyst._id);
    if (this.company._id) {
      this.http
        .post(environment.api + 'companies/update/' + this.company._id, fd, {})
        .subscribe((res) => {
          this.savedCompany = res;
        });
    } else {
      this.http
        .post(environment.api + 'companies/saveInitCompanyData', fd, {})
        .subscribe((res) => {
          this.savedCompany = res;
        });
    }
  }

  async fetchSectors() {
    const sector = this.sectors.find((s) => {
      return s?._id === this.company?.sector?._id;
    });
    this.selectSector(sector);
  }
  selectSector(sector: ISector) {
    this.selectedSector = sector;
    this.ratings = sector?.ratings.map((rating) => ({
      value: 0,
      rate_id: rating?._id,
      name: rating.name,
    }));
  }
  setRating(value: any, index: number) {
    this.ratings[index].rate_value = value.target.value;
  }
  setEstimation(value: any, index: number) {
    this.estimations[index].value = value.target.value;
  }
  selectAnalyst(user: IUser) {
    this.selectedAnalyst = user;
  }
}

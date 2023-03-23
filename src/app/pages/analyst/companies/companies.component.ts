import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICompany } from 'src/app/shared/models/company';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  companies: ICompany[] = [];
  selectedCompany:ICompany=undefined;
  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.companyService.getAnalystCompanies().subscribe(data => {
      this.companies = data.reverse();
    });
  }
  selectCompany(company:ICompany){
    if(this.selectedCompany){
      this.selectedCompany = undefined
      // this.companyService.getAnalystCompanies().subscribe(data => {
      //   this.companies = data.reverse();
      // });
    }
    setTimeout(() => {
      this.selectedCompany = company
    }, 200);
  }
}

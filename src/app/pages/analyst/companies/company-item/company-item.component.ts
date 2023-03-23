import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICompany } from 'src/app/shared/models/company';
import { CompanyService } from 'src/app/shared/services/company.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss']
})
export class CompanyItemComponent implements OnInit, OnDestroy {

  company: ICompany;
  filepath = environment.filepath;

  historicalUpdates: number = 0;
  updatesNumber: number = 0;

  versionStatus: number[] = [];

  report_list: any = [];

  show_publish_dialog = false
  show_delete_dialog = false
  selected_report = -1

  param$ = new Subject<String>()
  companies$= this.storeService.companies$
  company$ = combineLatest([
    this.param$,
    this.companies$
  ]).pipe(map(([name,list])=>{
    if(name){
      return list.find(c=>c._id===name)
    }
  }))

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private storeService:StoreService
) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.param$.next(params.get('id'))
      })
    }, 0);
    this.route.params.subscribe(data => {
     this.getCompany(data.id)
    })
  }
  getCompany(id:string){
    this.companyService.getOneCompany(id).subscribe(c => {
      this.company = c;
      this.updatesNumber = 0;
      // this.company.historical_excel.forEach(version => {
      //   this.versionStatus.push(version['push_status']);
      // })
      if(this.versionStatus.includes(0)) {
        this.historicalUpdates = 1;
      } else if(this.versionStatus.includes(1)) {
        this.historicalUpdates = 2;
        this.updatesNumber = this.updatesNumber + 1;
      } else {
        this.historicalUpdates = 0;
      }

      this.getCompanyReport(this.company._id)
    })
  }
  ngOnDestroy(): void {
    // this.routeSubscription.unsubscribe()
  }

  formatDate(date: string): string {
    return formatDate(date,'yyyy-MM-dd hh:MM',"en-US");
  }

  getCompanyReport(company_id: string) {
    this.companyService.getBothCompanyReport(company_id).subscribe(res => {
      this.report_list = res
    });
  }

  onReportEdit(index: number) {
    const report = this.report_list[index];
    this.router.navigateByUrl(`/analyst/report/${report._id}`)
  }

  onPublish(index: number) {
    this.show_publish_dialog = true
    this.selected_report = index
  }

  onDelete(index: number) {
    this.show_delete_dialog = true
    this.selected_report = index
  }

  confirmPublish() {
    this.show_publish_dialog = false

    if (this.selected_report < 0) {
      return
    }

    // publish
    const report = this.report_list[this.selected_report]
    this.companyService.publishReport(report)
      .subscribe((res => {
        this.selected_report = -1
      }))
  }

  confirmDelete() {
    this.show_delete_dialog = false

    if (this.selected_report < 0) {
      return
    }

    // delete
    const report = this.report_list[this.selected_report]
    this.companyService.deleteBothReport(report)
      .subscribe((res => {
        this.report_list.splice(this.selected_report)
        this.selected_report = -1
      }))

  }

  onAddReport() {
    this.router.navigateByUrl(`/analyst/report/create/${this.company._id}`)
  }


  updateListed(){
    this.companyService.updateListed(this.company._id).subscribe(res=>{
      this.getCompany(this.company._id)
    })
  }
  updatedIsNew(){
    this.companyService.updateIsNew(this.company._id).subscribe(res=>{
      this.getCompany(this.company._id)
    })
  }
  updateProcess(){
    this.companyService.updateProcess(this.company?._id).subscribe(res=>{
      this.getCompany(this.company?._id)
    })
  }

}

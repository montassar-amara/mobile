import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/app/shared/services/company.service';
import { MetaInjectorService } from 'src/app/shared/services/meta-injector.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  sectors$ =  this.companyService.fetchSectors();
  subscription$ = this.storeService.subscription$
  companies$ = this.storeService.companies$
  mycompanies$ = this.subscription$.pipe(map((subs)=>{
      let mycmps = []
      if(subs){
        if(subs.subscriptionIn && subs.subscriptionIn.length>0){
          mycmps = [...mycmps,...subs.subscriptionIn.map((c:any)=>c.company_id)]
        }
        if(subs.subscriptionOut && subs.subscriptionOut.length>0){
          mycmps = [...mycmps,...subs.subscriptionOut.map((c:any)=>c.company_id)]
        }
      }
      return mycmps;
  }))
  mySectors$ = combineLatest([
    this.sectors$,
    this.mycompanies$,
    this.companies$
  ]).pipe(map(([sectors,mycmps,companies])=>{
    const mysectors = []
    sectors.forEach(sector=>{
      const tmp = companies.filter(cmp=>cmp.sector?.name===sector?.name && mycmps.includes(cmp._id));
      if(tmp && tmp.length>0){
        mysectors.push(({...sector,companies:tmp}))
      }
      
    })
    return mysectors;
  }))

  constructor(private companyService: CompanyService,private storeService:StoreService,private metaInjectorService: MetaInjectorService) {
    this.metaInjectorService.addTag({
      title:'overview',
      description:'an overview of the platform',
      ogUrl:'valpal.io/overview'
    })
  }
  ngOnInit(): void {
  }

}

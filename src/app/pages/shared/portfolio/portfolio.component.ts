import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ICompany } from 'src/app/shared/models/company';
import { IPortfolio } from 'src/app/shared/models/portfolio';
import { SharesApiService } from 'src/app/shared/services/shares-api.service';

import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  addFunds = false;
  portfolio$ = new BehaviorSubject<IPortfolio>(undefined)
  stockValue$ = this.portfolio$.pipe(map(p=>{
    if(p?.companyPortfolio){
      return p.companyPortfolio.map(st=>st.shares*(st.now_price ?? st.cost)).reduce((p,c)=>p+c,0)
    }else return 0;
  }))
  totalFunds$ = combineLatest([
    this.portfolio$,
    this.stockValue$
  ]).pipe(map(([p,sv])=>p?.amount+sv))
  addNew = false;
  buyModal = false;
  sellModal = false;
  addedFunds = 0;
  stocksToBuy = 0;
  companies = combineLatest([this.store.companies$.pipe(map(cmps=>cmps.filter(cmp=>cmp.listed))),this.portfolio$]).pipe(map(([cmps,p])=>{
    if(p && p?.companyPortfolio?.length>0){
      return cmps.filter(c=>!p.companyPortfolio.some(pos=>pos.company_id===c._id))
    }else{
      return cmps;
    }
  }))
  selectedCompany:ICompany = undefined;
  selectedCompanySymbol:string = '';
  selectedCompanyPrice = 0;
  selectedCompanyShares = 0;
  total= 0;
  validShares = true;
  selectedPosition:any = undefined;
  constructor(private store:StoreService,private stocksService:SharesApiService) { }

  ngOnInit(): void {
    this.fetchPortfolio()
  }
  fetchPortfolio(){
    this.stocksService.fetchPortfolio().pipe(take(1)).subscribe(p=>{
      this.portfolio$.next(p)
    })
  }
  updateShares(nb:number){
    if(this.portfolio$.getValue()?.amount>=this.selectedCompanyPrice * nb) {
      this.selectedCompanyShares = nb;
      this.validShares = true;
    }
    else{
      this.validShares = false;
    }
    this.total = this.selectedCompanyPrice * this.selectedCompanyShares;
  }
  updateSharePrice(){  
    this.stocksService.fetchSharePrice(this.selectedCompanySymbol).pipe(take(1)).subscribe((data:any)=>{
      this.selectedCompanyPrice = data.price;
      this.updateShares(this.selectedCompanyShares)
    })
  }
  updateCompanySymbol(){
    this.stocksService.fetchStockSymbol(this.selectedCompany.name).pipe(map((data:any)=>{
      this.selectedCompanySymbol=  data.data.find(el=>el.currency==='USD')!.symbol as string;
      this.updateSharePrice()
    }),take(1)).subscribe()
    
  }
  updateSelectedCompany(company:ICompany){
    this.selectedCompany = company;
    this.updateCompanySymbol()
  }
  updateFunds(){
    this.stocksService.addFunds(this.addedFunds).pipe(take(1)).subscribe(res=>{
      this.addFunds = false;
      this.addedFunds = 0;
      this.fetchPortfolio();
    })
  }
  addToStocks(){
    const form = new FormData()
    form.append('company_id',this.selectedCompany._id);
    form.append('symbol',this.selectedCompanySymbol);
    form.append('cost',`${this.selectedCompanyPrice}`);
    form.append('shares',`${this.selectedCompanyShares}`);
    this.stocksService.addCompany(form).pipe(take(1)).subscribe(res=>{
      this.addNew = false;
      this.fetchPortfolio()
    })
  }
  updateStocksToBuy(nb:number){
    if(this.portfolio$.getValue()?.amount>=this.selectedCompanyPrice * nb) {
      this.stocksToBuy = nb;
      this.validShares = true;
    }
    else{
      this.validShares = false;
    }
    this.total = this.selectedCompanyPrice * this.stocksToBuy;
  }
  updateStocksToSell(nb:number){
    if(this.selectedPosition.shares>=nb) {
      this.stocksToBuy = nb;
      this.validShares = true;
    }
    else{
      this.validShares = false;
    }
    this.total = this.selectedCompanyPrice * this.stocksToBuy;
  }
  buy(){
    const form = new FormData();
    form.append('company_id',this.selectedPosition.company_id);
    form.append('cost',this.selectedPosition.now_price);
    form.append('shares',`${this.stocksToBuy}`);
    this.stocksService.buyStocks(form).pipe(take(1)).subscribe(res=>{
      this.buyModal = false;
      this.fetchPortfolio()
    })
  }
  sell(){
    const form = new FormData();
    form.append('company_id',this.selectedPosition.company_id);
    form.append('now_price',this.selectedPosition.now_price);
    form.append('shares',`${this.stocksToBuy}`);
    this.stocksService.sellStocks(form).pipe(take(1)).subscribe(res=>{
      this.sellModal = false;
      this.fetchPortfolio()
    })
  }
  StartAddNew(){
    this.addNew = true;
    this.selectedCompany = undefined;
    this.selectedCompanyPrice = 0;
    this.selectedCompanyShares = 0;
    this.selectedCompanySymbol = '';
    this.validShares = true;
  }
  StartAddFunds(){
    this.addFunds = true;
    this.addedFunds = 0;
  }
  startBuying(position:any){
    this.buyModal = true;
    this.selectedPosition = position;
    this.stocksService.fetchSharePrice(position.symbol).pipe(take(1)).subscribe((res:any)=>{
      this.selectedPosition.now_price = res.price;
    });
  }
  startSelling(position:any){
    this.sellModal = true;
    this.selectedPosition = position;
    this.stocksService.fetchSharePrice(position.symbol).pipe(take(1)).subscribe((res:any)=>{
      this.selectedPosition.now_price = res.price;
    });
  }
  synchronize(){
    this.stocksService.synchronize().subscribe()
  }
}

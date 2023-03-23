import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPortfolio } from '../models/portfolio';
@Injectable({
  providedIn: 'root'
})
export class SharesApiService {
  headers= {
    'X-RapidAPI-Key': '0f42725f6bmsh78635e10392c5dfp1917d5jsn071c8f6f7523',
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
  }
  constructor(private http:HttpClient) { }
  fetchSharePrice(symbol:string){
    const options = {
      headers: this.headers,
    };
    return this.http.get('https://twelve-data1.p.rapidapi.com/price?outputsize=30&format=json&symbol='+symbol,options)
  }
  fetchStockSymbol(name:string){
    const options = {
      headers: this.headers,
    };
    return this.http.get('https://twelve-data1.p.rapidapi.com/symbol_search?symbol='+name.replaceAll(' ','+').replaceAll('&','%26'),options)
  }
  addCompany(data:FormData){
    return this.http.post(environment.api+"portfolio/addCompany",data,{})
  }
  addFunds(funds:number){
    return this.http.get(environment.api+"portfolio/addfunds/"+`${funds}`,{})
  }
  fetchPortfolio(){
    return this.http.get<IPortfolio>(environment.api+"portfolio",{})
  }
  buyStocks(data:FormData){
    return this.http.post(environment.api+"portfolio/buy",data,{})
  }
  sellStocks(data:FormData){
    return this.http.post(environment.api+"portfolio/sell",data,{})
  }
  synchronize(){
    return this.http.get<IPortfolio>(environment.api+"portfolio/synchronize",{})
  }
  fetchStockTimeSeries(name:string){
    const options = {
      headers: this.headers,
    };
    return this.http.get('https://twelve-data1.p.rapidapi.com/time_series?interval=1month&outputsize=12&format=json&symbol='+name,options)
  }
  transactionHistory(){
    return this.http.get(environment.api+"portfolio/selandBuyHistorical",{})
  }
  monthlyPerformance(){
    return this.http.get(environment.api+"portfolio/MonthlyPerformance",{})
  }
  yearlyPerformance(){
    return this.http.get(environment.api+"portfolio/YearlyPerformance",{})
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICompany, IPrice } from '../models/company';
import {IColumn, IColumnValue, IEstimation, IRating, ISector, ITab, IValuation} from '../models/sectors';
import { IUser } from '../models/user';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies: any;
  preview: boolean = false;
  showPreviewBox: boolean = true;
  selectedCompany$ = new BehaviorSubject<ICompany>(undefined);
  tableContentState$ =  new BehaviorSubject<boolean>(true);
  constructor(
    private http: HttpClient,
  ) {
    this.getAllCompanies();
  }

/*
  getCompanies():Observable<ICompany[]>{
    return this.http.get<ICompany[]>(environment.api+"companies",{});
*/
  getAllCompanies(): Observable<ICompany[]>{
    return this.http.get<ICompany[]>(environment.api+"companies")
  }

  getCompaniesOut(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(environment.api+'subscriptions/companies_out', {});
  }


  getOneCompany(id: string): Observable<ICompany> {
    return this.http.get<ICompany>(environment.api+'companies/'+id,{});
  }

  getAnalystCompanies():Observable<ICompany[]>{// later we will change it to fetch analyst companies only
    return this.http.get<ICompany[]>(environment.api+"companies",{});
  }

  pushHistoricalUpdate(data: any): Observable<ICompany> {
    return this.http.post<ICompany>(environment.api+'excels/pushHistoricalUpdate', data, {});
  }
  fetchSectors(){
    return this.http.get<ISector[]>(environment.api+'sectors',{})
  }
  fetchRatings(){
    return this.http.get<IRating[]>(environment.api+'rating',{})
  }
  fetchEstimation(){
    return this.http.get<IEstimation[]>(environment.api+'estimationsGroup',{})
  }

  fetchSectorCompanies(sector_id) {
    return this.http.get<ITab[]>(environment.api+`companies/get_by_sector/${sector_id}`,{})
  }

  fetchTabs(sector_id) {
    return this.http.get<ITab[]>(environment.api+`sector_tabs/get_by_sector/${sector_id}`,{})
  }

  addTab(payload) {
    return this.http.post(environment.api + `sector_tabs/store`, payload)
  }

  updateTab(payload) {
    return this.http.post(environment.api + `sector_tabs/update/${payload._id}`, payload)
  }

  deleteTab(payload) {
    return this.http.delete(environment.api + `sector_tabs/delete/${payload._id}`)
  }

  fetchColumns(tab_id) {
    return this.http.get<IColumn[]>(environment.api+`sector_columns/get_by_tab/${tab_id}`,{})
  }

  addColumn(payload) {
    return this.http.post(environment.api + `sector_columns/store`, payload)
  }

  updateColumn(payload) {
    return this.http.post(environment.api + `sector_columns/update/${payload._id}`, payload)
  }

  deleteColumn(payload) {
    return this.http.delete(environment.api + `sector_columns/delete/${payload._id}`)
  }

  fetchColumnValue(payload) {
    return this.http.post(environment.api+`sector_columns/get_value`,payload)
  }

  fetchColumnValues(tab_id) {
    return this.http.get<IColumnValue[]>(environment.api+`sector_columns/get_values_by_tab/${tab_id}`, {})
  }

  saveColumnValue(payload) {
    return this.http.post(environment.api+`sector_columns/save_value`,payload)
  }

  saveColumnValues(payload) {
    return this.http.post(environment.api+`sector_columns/save_values`,payload)
  }


  addSector(sector:Partial<ISector>){
    const form = new FormData()
    form.append('name',sector.name)
    sector.ratings.forEach(rating=>form.append('rating_id[]',rating._id))
    return this.http.post(environment.api+'sectors/store',form)
  }
  updateSector(sector:Partial<ISector>){
    const form = new FormData()
    form.append('name',sector.name)
    sector.ratings.forEach(rating=>form.append('rating_id[]',rating._id))
    return this.http.post(environment.api+'sectors/update/'+sector._id,form)
  }
  deleteSector(id:string){
    return this.http.delete(environment.api+'sectors/delete/'+id)
  }

  addRating(rating:Partial<IRating>,file:File){
    const form = new FormData()
    form.append('name',rating.name)
    form.append('logo',file)
    return this.http.post(environment.api+'rating/store',form)
  }
  updateRating(rating:Partial<IRating>,file?:File){
    const form = new FormData()
    form.append('name',rating.name)
    if(file){
      form.append('logo',file)
    }
    return this.http.post(environment.api+'rating/update/'+rating._id,form)
  }
  deleteRating(id:string){
    return this.http.delete(environment.api+'rating/delete/'+id)
  }
  addEstimation(est:Partial<IEstimation>){
    const form = new FormData()
    form.append('name',est.name)
    return this.http.post(environment.api+'estimationsGroup/store',form)
  }
  updateEstimation(est:Partial<IEstimation>){
    const form = new FormData()
    form.append('name',est.name)
    return this.http.post(environment.api+'estimationsGroup/update/'+est._id,form)
  }
  deleteEstimation(id:string){
    return this.http.delete(environment.api+'estimationsGroup/delete/'+id)
  }
  getAnalyst(){
    return this.http.get<IUser[]>(environment.api+'companies/analysts/list')
  }
  fetchPrices(){
    return this.http.get<IPrice[]>(environment.api+'pricesCompanies')
  }
  savePrices(prices:any){
    return this.http.post<string>(environment.api+'pricesCompanies/store',prices)
  }

  getCompanyReport(company_id: string): Observable<any> {
    return this.http.get(environment.api + `reports/company/${company_id}`);
  }

  publishReport(report: any): Observable<any> {
    return this.http.post(environment.api + `reports/publish/${report._id}`, report);
  }

  getBothCompanyReport(company_id: string): Observable<any> {
    return this.http.get(environment.api + `reports/company_both/${company_id}`);
  }

  getOneReport(report_id: string): Observable<any> {
    return this.http.get(environment.api + `reports/one_report/${report_id}`);
  }

  addTempReport(report: any): Observable<any> {
    return this.http.post(environment.api + `reports/add_temp_report`, report);
  }

  updateTempReport(report: any): Observable<any> {
    return this.http.post(environment.api + `reports/update_temp_report/${report._id}`, report);
  }

  deleteBothReport(report: any): Observable<any> {
    return this.http.post(environment.api + `reports/delete_both_report/${report._id}`, report);
  }

  uploadReportImage(file: File) {
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post(environment.api + 'reports/upload_image', fd);
  }


  uploadReportImageBas64(report_image: any): Observable<any> {
    const payload = {
      report_image
    }
    return this.http.post(environment.api + 'reports/upload_image_base64', payload);
  }

  addValuation(value:string){
    const form = new FormData()
    form.append('name_attribute',value)
    return this.http.post(environment.api + `valuationsGroup/store`, form);
  }
  deleteValuation(value:string){
    return this.http.delete(environment.api + `valuationsGroup/delete/${value}`);
  }
  fetchValuation(){
    return this.http.get<IValuation[]>(environment.api + `valuationsGroup`);
  }
  updateListed(id:string){
    return this.http.get<any>(environment.api + `companies/update_is_listed/${id}`)
  }
  updateIsNew(id:string){
    return this.http.get<any>(environment.api + `companies/update_is_new/${id}`)
  }
   updateProcess(id:string){
    return this.http.get<any>(environment.api + `companies/update_process/${id}`)
  }
}

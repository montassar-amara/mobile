import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITempCompany } from '../models/tempCompany';

@Injectable({
  providedIn: 'root'
})
export class TempCompaniesService {

  constructor(private http: HttpClient) { }
  getAllCompanies(): Observable<ITempCompany[]>{
    return this.http.get<ITempCompany[]>(environment.api+"tmpCompanies")
  }
  addCompany(tmp:Partial<ITempCompany>){
    const form =  new FormData()
    form.append('name',tmp.name);
    if(tmp.logo){
      form.append('image',tmp.logo);
    }
    form.append('tag_name',tmp.tag_name);
    form.append('tag_link',tmp.tag_link);
    form.append('link',tmp.link);
    form.append('state',tmp.state);
    form.append('order',`${tmp.order}`);

    return this.http.post<string>(environment.api+"tmpCompanies/store",form)
  }

  updateCompanies(collection:ITempCompany[],state:string){
    const form = new FormData()
    collection.forEach(c=>{
      form.append('companies_id[]',c._id)
    })
    return this.http.post<string>(environment.api+"tmpCompanies/updateOrder/"+state,form)
  }
  deleteCompany(id:string){
    return this.http.delete<string>(environment.api+"tmpCompanies/delete/"+id)
  }
}

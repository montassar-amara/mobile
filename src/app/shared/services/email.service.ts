import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(
    private http: HttpClient
  ) { }
  sendEmail(form:any){
    return this.http.post(environment.api+"contact",form)
  }
  sendUserEmail(form:any){
    return this.http.post(environment.api+"userContact",form)
  }
  businessAdd(form:any){
    return this.http.post(environment.api+"businessRegister",form)
  }
}

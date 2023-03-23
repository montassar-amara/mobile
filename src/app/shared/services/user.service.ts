import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  api = environment.api;
  constructor(
    private http: HttpClient,
    ) { }

  getPrincipal():Observable<IUser>{
    return this.http.get<IUser>(environment.api+'auth/getLoggedInUser', {})
  }
  getUsers(){
    return this.http.get<IUser[]>(environment.api+'users', {})
  }
  deleteUser(id:string){
    return this.http.delete<any>(environment.api+'users/delete/'+id, {})
  }
  updateNotification(we_find_by:string,notify_by_phone:boolean,notify_by_email:boolean,phone_code:string, phone_number:string):Observable<string>{
    const form = new FormData()
    form.append("we_find_by",we_find_by)
    form.append("notify_by_phone",`${notify_by_phone}`)
    form.append("notify_by_email",`${notify_by_email}`)
    form.append("phone_code", phone_code)
    form.append("phone_number", phone_number)
    form.append("phone_number_notify",phone_code + phone_number)
    return this.http.post<string>(environment.api+'updateNotificationType', form)
  }

  /*getLoggedInUser():Observable<IUser> {
    return this.http.get<IUser>(environment.api+'getLoggedInUser', this.{});
  }*/

  updateMainInfo(request:Partial<IUser> & {newAvatar?:string},id:string){
    // return this.fake.updatePrincipal(request,request.newAvatar,id)
  }

  updateMainUserInfo(data: any):Observable<IUser> {
    return this.http.post<IUser>(environment.api+'user/updateMainUserInfo', data, {});
  }

  getUserData(id: string):Observable<IUser> {
    return this.http.get<IUser>(environment.api+'getUserData/'+id,{});
  }

  deleteAccountRequest(data: any): Observable<any> {
    return this.http.post<any>(this.api+'deleteAccountRequest', data);
  }
  getDeleteAccountRequest(id: any): Observable<any[]> {
    return this.http.get<any[]>(this.api+'getDeleteAccountRequest/'+id);
  }
  CancelDeleteAccountRequest(id: string): Observable<any> {
    return this.http.post<any>(this.api+'CancelDeleteAccountRequest', {id});
  }

  verifyUniquePhone(code:string,phone:string):Observable<any> {
    const form = new FormData()
    form.append('phone_code',code)
    form.append('phone_number',phone)
    return this.http.post<any>(environment.api+'users/checkexistphone',form);
  }
}

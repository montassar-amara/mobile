import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INotification } from '../models/notification';



@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private http: HttpClient,
  ) { }

  getNotifications(){
    return this.http.get<{notification:INotification[]}>(environment.api+'notifications/',{});
  }
  updateNotification(id:string){
      return this.http.put<any>(environment.api+'notifications/'+id+'/update',{},{});
  }
  deleteNotification(id:string){
    return this.http.delete<any>(environment.api+'notifications/deletenotification/'+id,{});
}
}

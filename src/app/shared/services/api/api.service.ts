import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    ) {}

  updatePassword(data: any): Observable<any> {
    return this.http.post(API + 'updatePassword', data);
  }


  uploadProfileAvatarBase64(avatar: any): Observable<any> {
    const payload = {
      avatar
    }
    return this.http.post(API + 'uploadProfileAvatarBase64', payload);
  }


}

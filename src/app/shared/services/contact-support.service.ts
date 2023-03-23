import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IContactSupport } from '../models/ContactSupport';

@Injectable({
  providedIn: 'root'
})
export class ContactSupportService {

  constructor(
    private http: HttpClient
  ) { }

  addContactSupportMsg(data: any): Observable<IContactSupport> {
    return this.http.post<IContactSupport>(environment.api+'contacts/addContactSupportMsg', data);
  }
}

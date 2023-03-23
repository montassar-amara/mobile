import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataRefresherService {

  subject = new Subject();

  constructor() { }

  setMessage(msg) {
    this.subject.next(msg);
  }

  getMessage() {
    return this.subject.asObservable();
  }
}

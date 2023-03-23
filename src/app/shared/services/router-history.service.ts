import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterHistoryService {
  next$ = new BehaviorSubject<boolean>(true);
  previous$ = new BehaviorSubject<boolean>(true);
  currentIndex = -1;
  history:string[]= [];
  navigating=false;
  constructor(private router:Router) {
    this.next$.subscribe(()=>{
      if(this.currentIndex<this.history.length-1){
        const url = this.history[this.currentIndex+1]
        this.currentIndex+=1;
        this.navigating=true;
        this.router.navigate([url]);
      }
    })
    this.previous$.subscribe(()=>{
      if(this.currentIndex>0){
        const url = this.history[this.currentIndex-1]
        this.currentIndex-=1;
        this.navigating=true;
        this.router.navigate([url]);
      }
    })
  }
}

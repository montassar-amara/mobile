import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SeePlansService {
  showSeeOurPlansModal: boolean = false;
  isFromRegisterStep: boolean = false;

  selectPlanModal: boolean = false;

  constructor(private route: Router) {}

  seePlans(register: string): void {
    this.isFromRegisterStep = register ? true : false;
    if (window.innerWidth >= 768) {
      this.showSeeOurPlansModal = true;
    } else {
      this.route.navigateByUrl('/see-our-plans');
    }
  }
}

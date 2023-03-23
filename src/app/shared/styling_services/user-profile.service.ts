import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  activeTab: string = 'overview';
  constructor() {}
  setActiveTab(str: string): void {
    this.activeTab = '';
  }
}

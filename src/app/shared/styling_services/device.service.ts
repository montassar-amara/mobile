import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  isMobile: boolean = window.innerWidth < 768 ? true : false;
  isSmallerMobile: boolean = window.innerWidth < 576 ? true : false;
  isDesktop: boolean = window.innerWidth >= 1024 ? true : false;

  isSearchbarVisible = false;

  constructor() {}
}

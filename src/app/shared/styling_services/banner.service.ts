import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  showBanner: boolean = true;
  constructor() {}
}

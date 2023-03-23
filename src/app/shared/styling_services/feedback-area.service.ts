import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedbackAreaService {
  showFeedbackArea: boolean = false;
  showContribute = false;
  constructor() {}

  toggleFeedbackArea(): void {
    this.showFeedbackArea = !this.showFeedbackArea;
  }
  closeFeedbackArea(){
    this.showFeedbackArea = false
  }
}

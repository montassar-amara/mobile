import { Pipe, PipeTransform } from '@angular/core';
import { INotification } from '../models/notification';

@Pipe({
  name: 'notifTitle'
})
export class NotifTitlePipe implements PipeTransform {

  transform(ntf: INotification): string {
    if(ntf.type==='Updated')
      return 'Feedback status changed'
    if(ntf.type==='commented')
      return 'New comment'
    if(ntf.type==='Merge')
      return 'Feedback merge'
  }

}

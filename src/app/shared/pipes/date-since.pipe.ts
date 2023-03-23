import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSince'
})
export class DateSincePipe implements PipeTransform {

  transform(date:any,args?:number,noMsg=false): string {
    let value = date
    if(date?.$date?.$numberLong){
      value = Number.parseInt(date?.$date?.$numberLong)
    }
    if(args!==undefined){
      value = new Date(value)
      value = value.setDate(value.getDate()+args)
    }
    if (value!==undefined) {
      const timeDiff= (+new Date() - +new Date(value));
      const seconds = Math.floor(Math.abs(timeDiff) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
          return 'Just now';
      const intervals: { [key: string]: number } = {
          'year': 31536000,
          'month': 2592000,
          'week': 604800,
          'day': 86400,
          'hour': 3600,
          'minute': 60,
          'second': 1
      };
      let counter;
      const word = timeDiff>0?'ago':'left'
      if(args!==undefined){
        counter = Math.floor(seconds / intervals['day']);
        if (counter === 1) {
          return noMsg?counter:`${counter} day ${word}`; // singular (1 day ago)
      } else {
          return noMsg?counter:`${counter} days ${word}`; // plural (2 days ago)
      }
      }
      for (const i in intervals) {
          counter = Math.floor(seconds / intervals[i]);
          if (counter > 0)
              if (counter === 1) {
                  return noMsg?counter:`${counter} ${i} ${word}`; // singular (1 day ago)
              } else {
                  return noMsg?counter:`${counter} ${i}s ${word}`; // plural (2 days ago)
              }
      }
  }
  return value;
}

}

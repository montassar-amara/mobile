import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isImage'
})
export class IsImagePipe implements PipeTransform {

  transform(value: string): boolean {
    return value.match(/\.(jpg|jpeg|png|gif|svg)$/i)?.length>0;
  }

}

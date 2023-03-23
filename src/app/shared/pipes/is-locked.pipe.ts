import { Pipe, PipeTransform } from '@angular/core';
import { ICompany } from '../models/company';

@Pipe({
  name: 'isLocked'
})
export class IsLockedPipe implements PipeTransform {
  transform(rapport:any,company:ICompany,isMine:boolean): boolean {
    return !(company?.is_free || isMine || rapport?.is_free) ;
  }

}

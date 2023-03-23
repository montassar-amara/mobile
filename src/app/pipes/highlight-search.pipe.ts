import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch',
})
export class HighlightSearchPipe implements PipeTransform {

   getChar() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    return characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  transform(value: any, args: any, encoding: boolean): unknown {
    if(!args) return value;

    const re = new RegExp("(" + args + ")(?!([^<]+)?>)", "gi");
    value= String(value).replace(re, '<span tabindex=0 class="highlighted-text">$&</span>');

    return value;
  }
}

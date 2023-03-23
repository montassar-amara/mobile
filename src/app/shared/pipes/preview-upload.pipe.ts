import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'previewUpload'
})
export class PreviewUploadPipe implements PipeTransform {
  constructor(
    private sanitize: DomSanitizer
  ){}
  transform(file:File): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

}

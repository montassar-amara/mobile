import { Injectable } from '@angular/core';

const REPORT_DATA = 'report-data';


@Injectable({
  providedIn: 'root'
})
export class ReportStorageService {

  constructor() { }


  public saveReportData(report_data: any): void {
    window.sessionStorage.removeItem(`${REPORT_DATA}-${report_data._id}`);
    window.sessionStorage.setItem(`${REPORT_DATA}-${report_data._id}`, JSON.stringify(report_data));
  }

  public removeReportData(report_id: any): void {
    window.sessionStorage.removeItem(`${REPORT_DATA}-${report_id}`);
  }


  public getReportData(report_id: string): string | null {
    return window.sessionStorage.getItem(`${REPORT_DATA}-${report_id}`);
  }


}

import { Component, Input, OnInit } from '@angular/core';
// import * as GC from '@grapecity/spread-sheets';
// import * as ExcelIO from "@grapecity/spread-excelio";
import { ICompany } from 'src/app/shared/models/company';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'app-current-file',
  templateUrl: './current-file.component.html',
  styleUrls: ['./current-file.component.scss']
})
export class CurrentFileComponent implements OnInit {

  currentCompany: ICompany;

  // currentSpread: GC.Spread.Sheets.Workbook;

  hostStyle = {
    width: 'calc(100vw - 20px)',
    height: '60vh',
    overflow: 'hidden',
    float: 'left'
  };
  jsonFromDB: any;
  // excelIo = new ExcelIO.IO();
  frozenInfo: any;
  // SpreadStyle = new GC.Spread.Sheets.Style();

  constructor(
    private router: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.frozenInfo = {
      rowCount: 1,
      columnCount: 3,
    }
  }

  ngOnInit(): void {
    this.router.params.subscribe(data => {
      this.companyService.getOneCompany(data.id).subscribe(res => {
        this.currentCompany = res;
        this.currentCompany['historical_excel'].forEach(el => {
          if(el.status === true && el.push_status === 2) {
            this.jsonFromDB = el.workbook;
            // let spread2 = this.currentSpread;
            // spread2.fromJSON(el.workbook);
            // spread2.sheets.forEach(sheet => {
            //   sheet.suspendPaint();
            //   let defaultStyle = sheet.getDefaultStyle();
            //   defaultStyle.backColor ="#1B1B1B";
            //   defaultStyle.foreColor ="#7E7E7E";
            //   defaultStyle.applyBorder = true;
            //   sheet.options.gridline.color = "#282828"

            //   //sheet.options.gridline.showHorizontalGridline = true;
            //   //sheet.options.gridline.showVerticalGridline = true;
            //   sheet.resumePaint();
            //   sheet.setDefaultStyle(defaultStyle)
            //   spread2.resumePaint();
            // })
          }
        })

      })
    })
  }

  initCurrentSpread($event: any) {
    // this.currentSpread = $event.spread;
    // let cspread = this.currentSpread;
    // cspread.options.calcOnDemand = true;

    // // let sheett = cspread.getActiveSheet();
    // let defaultStyle = sheett.getDefaultStyle();
    // defaultStyle.backColor ="#1B1B1B";
    // defaultStyle.foreColor ="7e7e7e";
    // defaultStyle.applyBorder = true;
    // sheett.options.gridline.color = "#282828"

    // sheett.setDefaultStyle(defaultStyle)

    // cspread.resumePaint();
    // let sheet = cspread.getSheet(0);

    // sheet.frozenRowCount(this.frozenInfo.rowCount);
    // sheet.frozenColumnCount(this.frozenInfo.columnCount);
    //this.paintRowColHeaders();
  }

}

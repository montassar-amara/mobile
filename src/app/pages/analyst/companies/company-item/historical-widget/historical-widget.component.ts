import { Component, OnInit } from '@angular/core';
// import * as GC from '@grapecity/spread-sheets';
// import * as ExcelIO from "@grapecity/spread-excelio";
import { ActivatedRoute, Router } from '@angular/router';
import { ICompany } from 'src/app/shared/models/company';
import { CompanyService } from 'src/app/shared/services/company.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

let spreadAsJson: any[] = [];



@Component({
  selector: 'app-historical-widget',
  templateUrl: './historical-widget.component.html',
  styleUrls: ['./historical-widget.component.scss']
})
export class HistoricalWidgetComponent implements OnInit {
  importExcelFile: any;

  frozenInfo: any;
  sheets: any[] = []

  currentCompany: ICompany;

  // spread: GC.Spread.Sheets.Workbook;

  hostStyle = {
    width: '100%',
    height: '60vh',
    overflow: 'hidden',
    float: 'left'
  };

  // excelIo = new ExcelIO.IO();
  noExcelFile: boolean = true;

  // SpreadStyle = new GC.Spread.Sheets.Style();

  constructor(
    private router: ActivatedRoute,
    private companyService: CompanyService,
    private http: HttpClient,
    private route: Router
  ) {
    this.frozenInfo = {
      rowCount: 1,
      columnCount: 3,
    }
  }

  ngOnInit(): void {
    //this.spread.options.scrollbarAppearance.toLocaleString('mobile');
    this.router.params.subscribe(data => {
      this.companyService.getOneCompany(data.id).subscribe(res => {
        this.currentCompany = res;
      })
    })
  }


  copyPreviousFile() {
    this.noExcelFile = false;
    setTimeout(() => {
      // let spread = this.spread;
      this.router.params.subscribe(data => {
        this.companyService.getOneCompany(data.id).subscribe(res => {
          this.currentCompany = res;

          this.currentCompany['historical_excel'].forEach(el => {
            if(el.status === true) {
              // spread.fromJSON(el.workbook);

              //let sheett = this.spread.getActiveSheet();

              // this.spread.sheets.forEach(sheett => {
              //   let defaultStyle = sheett.getDefaultStyle();
              //   defaultStyle.backColor ="#1B1B1B";
              //   defaultStyle.foreColor ="#FFFFFF";

              //   sheett.suspendPaint();
              //   sheett.options.gridline.showHorizontalGridline = true;
              //   sheett.options.gridline.showVerticalGridline = true;
              //   sheett.options.gridline.color = "#ffffff";
              //   sheett.options.frozenlineColor = "#282828";

              //   sheett.frozenRowCount(1);
              //   sheett.frozenColumnCount(3);
              //   sheett.resumePaint();


              // })


            }
          })

          spreadAsJson = [];

          // for (let index = 0; index < spread.getSheetCount(); index++) {
          //   spreadAsJson.push(
          //     {
          //       sheetname: spread.getSheet(index).toJSON()['name'],
          //       status: true //to put it as shown or hidden in the html part (disable or enable sheet item)
          //     }
          //   )
          // }
        })
      })
    }, 500);

  }

  CancelSheetLoad() {
    spreadAsJson = [];
    this.noExcelFile = true;
    // this.initSpread(this.spread)
  }

  initSpread($event: any) {

    // this.spread = $event.spread;
    //this.spread.options.backColor = "#1b1b1b";
    // let style = new GC.Spread.Sheets.Style();
    // style.backColor = "#ff3333";
    // let sheett = this.spread.getActiveSheet();



    //sheett.setValue(0, 0, "Hello World!");
    // let defaultStyle = sheett.getDefaultStyle();
    // defaultStyle.backColor ="#1B1B1B";
    // defaultStyle.foreColor ="#FFFFFF";

    // sheett.setDefaultStyle(defaultStyle)



    //this.SpreadStyle.backColor = "green"
    // let spread = this.spread;
    //spread.getActiveSheet().getCell().foreColor('white');
    //spread.options.backColor = '#181818';
    // spread.sheets.forEach(sh => {
    //   sh.getCell(1,1,null).foreColor('red')
    // })
    //spread.options.grayAreaBackColor = '#181818';
    // spread.options.calcOnDemand = true;
    // spread.resumePaint();
    // let sheet = spread.getSheet(0);
    // sheet.frozenRowCount(this.frozenInfo.rowCount);
    // sheet.frozenColumnCount(this.frozenInfo.columnCount);
    // this.paintRowColHeaders();

    // style = new GC.Spread.Sheets.Style();
    // style.name = 'BorderStyle';
    // style.applyBorder = true;
    // spread.addNamedStyle(style);
  }

  test() {
    // let x = this.spread.toJSON();
    // let r = Object.keys(x).map((key) => [Number(key), x[key]]);
  }

  paintRowColHeaders() {
    // Row Header
    // let oldRowHeaderPaint = GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint;
    // GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
        //style.backColor = "#303030"
        // if (value === 1 || value === 2) {
        //     oldRowHeaderPaint.apply(this, [ctx, "", x, y, w, h, style, context]);
        // } else {
        //     oldRowHeaderPaint.apply(this, [ctx, value - 2, x, y, w, h, style, context]);
        // }
    }

    // Column Header
    // let oldColumnHeaderPaint = GC.Spread.Sheets.CellTypes.ColumnHeader.prototype.paint;
    // GC.Spread.Sheets.CellTypes.ColumnHeader.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
    //     // let columnIndex =
    //     //style.backColor = "#303030"
    //     if (value === "A" || value === "B") {
    //         oldColumnHeaderPaint.apply(this, [ctx, "", x, y, w, h, style, context]);
    //     } else {
    //         // Get the Column Number from column name
    //         let columnNumber = GC.Spread.Sheets.CalcEngine.evaluateFormula(context.sheet, `COLUMN(${value}1)`, 0, 0);
    //         // Get the address of the cell with column number 2 less than actual column number
    //         let address = GC.Spread.Sheets.CalcEngine.evaluateFormula(context.sheet, `ADDRESS(1, ${columnNumber - 2}, 1, true)`, 0, 0);
    //         // Get the Column Name
    //         let columnName = address.substring(address.indexOf('$') + 1, address.lastIndexOf('$'));
    //         oldColumnHeaderPaint.apply(this, [ctx, columnName, x, y, w, h, style, context]);
    //     }
    // }
  }

  // uploadExcelFile(event: any) {
  //   this.importExcelFile = event.target.files[0];
  //   this.noExcelFile = false;
  //   setTimeout(() => {
  //     let spread = this.spread;

  //     let excelFile = this.importExcelFile;
  //     let incrementalEle = document.getElementById("incremental") as HTMLInputElement;
  //     let loadingStatus = document.getElementById("loadingStatus") as HTMLInputElement;

  //     // here is excel IO API
  //     this.excelIo.open(excelFile, function (json: any) {
  //       let  workbookObj = json;
  //       spread!.fromJSON(workbookObj, {
  //         incrementalLoading: {
  //           loaded: function() {
  //             spread.options.backColor = '#1F1F1F';
  //             //spread.options.grayAreaBackColor = '#181818';

  //             //spread.options.backColor = "#1b1b1b"
  //             spread.options.grayAreaBackColor = "#1b1b1b";
  //             let sheet = spread.getActiveSheet();

  //             /*let defaultStyle = sheet.getDefaultStyle();
  //             //defaultStyle.backColor ="black";
  //             defaultStyle.foreColor ="yellow";
  //             sheet.setDefaultStyle(defaultStyle)*/

  //             spread.sheets.forEach(sheett => {
  //               let defaultStyle = sheett.getDefaultStyle();
  //               sheett.setDefaultStyle(defaultStyle);
  //               sheett.suspendPaint();
  //               sheett.options.gridline.showHorizontalGridline = true;
  //               sheett.options.gridline.showVerticalGridline = true;
  //               sheett.options.gridline.color = "#282828";
  //               sheett.options.frozenlineColor = "#333";
  //               sheett.frozenRowCount(1);
  //               sheett.frozenColumnCount(3);
  //               let jsonSheet = sheett.toJSON();
  //               /*for (let c = 0; c <= jsonSheet['rows'].length; c++) {
  //                 sheett.getCell(c, 0).backColor('#181818');
  //                 sheett.getCell(c, 1).backColor('#181818');
  //                 sheett.getCell(c, 2).backColor('#181818');
  //               }
  //               for (let c = 0; c <= jsonSheet['columns'].length; c++) {
  //                 sheett.getCell(0, c).backColor('#181818');
  //               }*/
  //               defaultStyle.foreColor ="#BEBEBE";
  //               sheett.resumePaint();

  //             })



  //             /*let style = new GC.Spread.Sheets.Style();
  //             sheet.getCell(0,0).value("Click the button here ->").vAlign(GC.Spread.Sheets.VerticalAlign.bottom);
  //             sheet.setStyle(0, 0, style);
  //             style = new GC.Spread.Sheets.Style();
  //             style.cellButtons = [
  //                   {
  //                     caption:"Alert",
  //                     buttonBackColor: "#00C2D6",
  //                     command: (sheet, row, col, option) => {
  //                     alert("This is an alert."+row+"----"+col);
  //                     }
  //                 }
  //             ];*/

  //             let jsonSheet = sheet.toJSON();

  //             /*for (let c = 0; c <= jsonSheet['rows'].length; c++) {
  //               sheet.getCell(c, 0).backColor('#181818');
  //               sheet.getCell(c, 1).backColor('#181818');
  //               sheet.getCell(c, 2).backColor('#181818');
  //             }
  //             for (let c = 0; c <= jsonSheet['columns'].length; c++) {
  //               sheet.getCell(0, c).backColor('#181818');
  //             }

  //             for (let i = 0; i <= jsonSheet['rows'].length; i++) {
  //               //sheet.getCell(c, 1).backColor('#82bc00').foreColor('white');
  //               for (let j = 0; j < jsonSheet['columns'].length; j++) {
  //                 sheet.getCell(i, j).foreColor('white');
  //               }
  //             }*/

  //             spreadAsJson = [];
  //             for (let index = 0; index < spread.getSheetCount(); index++) {
  //               spreadAsJson.push(
  //                 {
  //                   sheetname: spread.getSheet(index).toJSON()['name'],
  //                   status: true //to put it as shown or hidden in the html part (disable or enable sheet item)
  //                 }
  //               )
  //             }
  //           }
  //         }
  //       });
  //     });
  //   }, 10);
  // }

  // get spreadAsJson() {
  //   return spreadAsJson;
  // }

  // hideSheet(sheet: any) {
  //   let spread = this.spread;
  //   let sheetItem = spread.getSheetFromName(sheet.sheetname);
  //   if (sheet.status) {
  //     sheetItem.visible(false);
  //   } else {
  //     sheetItem.visible(true)
  //     //spread.setActiveSheet(spread.getSheetFromName(sheet.sheetname))
  //   }
  //   sheet.status = !sheet.status;
  // }

  // loadExcel(e: any) {

  //   let spread = this.spread;
  //   let excelFile = this.importExcelFile;
  //   let incrementalEle = document.getElementById("incremental") as HTMLInputElement;
  //   let loadingStatus = document.getElementById("loadingStatus") as HTMLInputElement;

  //   // here is excel IO API
  //   this.excelIo.open(excelFile, function (json: any) {
  //     let  workbookObj = json;

  //     spread!.fromJSON(workbookObj, {
  //       incrementalLoading: {
  //         loaded: function() {
  //         }
  //       }
  //     });
  //   });
  // }

// }

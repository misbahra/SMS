import { Component, Injectable } from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LovComponent} from '../lov/lov.component';
import { sessionService } from '../ws/sessionWS';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

//https://alligator.io/js/introduction-localstorage-sessionstorage/

@Injectable()
export class utilWS {
  constructor(
    public dialog: MatDialog,
    private sessionService : sessionService
  ) { 
   
  }

 
//   lov_selected_values: any = []

//  setLovDate(data:any)
//  {
//    this.lov_selected_values = data;
//  } 

//  getLovDate()
//  {
//    return this.lov_selected_values;
//  }

 getUID(type:String)
  {
    var prefix = "";
    if (type == "order_item_uid") {prefix = "OI"}
    else if(type == "order_uid") {prefix = "O"}
    else if(type == "stock_uid") {prefix = "ST"}
    else if(type == "item_uid") {prefix = "IT"}
    else if(type == "item_categories_uid") {prefix = "IC"}
    else if(type == "vender_uid") {prefix = "V"}
    else if(type == "gl_uid") {prefix = "GL"}
    else if(type == "vender_accounts_uid") {prefix = "VA"}
    else if(type == "cat_uid") {prefix = "CT"}
    else if(type == "customer_uid") {prefix = "CUS"}
    else if(type == "resource_uid") {prefix = "RES"}
    else if(type == "sal_header_uid") {prefix = "SAL"}
    else if(type == "sal_detail_uid") {prefix = "SALD"}
    else {prefix = ""} ;

    var d = new Date();
    return( prefix + d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+ 
            d.getHours() + d.getMinutes() + d.getSeconds()+d.getMilliseconds()
    );
  }

  getDate()
  {
    var d = new Date();
    return( d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"  "+ 
            d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds()
               );
  }

  formatNumber(num) {
   
    return Math.floor(num)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

   // open the new / update form
   // parameters lov type can be LUH - LU Header, 
   //                            LUD  - LU Details
   //                            USR  - Users
   //                            VEN  - Venders
  //                             CAT  - Categories
  //                             ITM  - Items
  //                             CIT  - Cities
  //                             CON  - Countries
  //                             STA  - States
  //                             VAC  - Vender Accounts
  //                             CUS  - Customers                           
   // Nature : S - single value selection , M - Multile value selection
   openLov  (lov_type: any , lov_nature: any, callback ) {
    //this.lov_selected_values = [];
    this.sessionService.lov_selected_values = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = { type : lov_type , lovNature: lov_nature};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
   
    const dialogRef = this.dialog.open(LovComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        if (result = 'S') {callback(this.sessionService.lov_selected_values )}
        else {callback([])}
  });
}

generatePdf(docDefinition : any , action:any){

  (<any>pdfMake).tableLayouts = {
    exampleLayout: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return (i === node.table.headerRows) ? 2 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#aaa';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return (i === node.table.widths.length - 1) ? 0 : 8;
      }
    }
  };
  

  if(action==='download'){    
    pdfMake.createPdf(docDefinition).download();    
  }else if(action === 'print'){    
    pdfMake.createPdf(docDefinition).print();          
  }else{    
    pdfMake.createPdf(docDefinition).open();          
  }    
 
 }

 public exportAsExcelFile(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}

public exportTableAsExcelFile(tableNmae : string, excelFileName: string): void {
   /* table id is passed over here */   
   let element = document.getElementById('tableNmae'); 
  const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}

private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
}


}
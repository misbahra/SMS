import { Component, Injectable } from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LovComponent} from '../lov/lov.component';
import { sessionService } from '../ws/sessionWS';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

//https://alligator.io/js/introduction-localstorage-sessionstorage/

@Injectable()
export class utilWS {
  constructor(
    public dialog: MatDialog,
    private sessionService : sessionService,
    public datepipe: DatePipe
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
    else if(type == "image_upload") {prefix = "IMGN"} // to get image name
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

  // (<any>pdfMake).tableLayouts = {
  //   exampleLayout: {
  //     hLineWidth: function (i, node) {
  //       if (i === 0 || i === node.table.body.length) {
  //         return 0;
  //       }
  //       return (i === node.table.headerRows) ? 2 : 1;
  //     },
  //     vLineWidth: function (i) {
  //       return 0;
  //     },
  //     hLineColor: function (i) {
  //       return i === 1 ? 'black' : '#aaa';
  //     },
  //     paddingLeft: function (i) {
  //       return i === 0 ? 0 : 8;
  //     },
  //     paddingRight: function (i, node) {
  //       return (i === node.table.widths.length - 1) ? 0 : 8;
  //     }
  //   }
  // };
  
  

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

public setStockCode(
  itemsDataList : any,
  vendersDataList : any,
  stock_received_on : Date,
  stock_uid: string,
  p_item_uid: string,
  p_vender_uid: string,
  stuff: string,
  brand: string,
  color: string,
  design_code: string
){
  //alert(this.dataForm.value.stock_received_on);

  var item;
  var vender;
  var stock_received_date;
  var stockCode = '';
  var separator ='';
  var barCode = stock_uid;
  var finalData : any = {};

   item = itemsDataList.find(({ item_uid }) => item_uid === p_item_uid);
   vender = vendersDataList.find(({ vender_uid }) => vender_uid === p_vender_uid);
   stock_received_date = this.datepipe.transform(stock_received_on, 'yyyyMMdd');
  
  if (stockCode == '' ){} else {separator = '-'}
  if (!stock_received_date) {stockCode = stockCode + separator +  '********'} else { stockCode = stockCode + separator + ('********' + stock_received_date).slice(-8)}
  
  if (stockCode == '' ){} else {separator = '-'}
  if (!item) {
    stockCode = stockCode + separator +  '******';
  } 
  else { 
    stockCode = stockCode + separator +  ('********' + item.item_code).slice(-8);
    barCode = barCode + ('00000000' + item.item_code).slice(-8);
  }
// no separator or padding in the item code and stuff for better seaching on the order form 
  if (stockCode == '' ){} else {separator = ''}
  if (stuff == '') {stockCode = stockCode + separator +  ''} else { stockCode = stockCode + separator + (stuff)}

  if (stockCode == '' ){} else {separator = ''}
  if (brand == '') {stockCode = stockCode + separator +  '****'} 
  else { 
    stockCode = stockCode + separator + (brand + '****').slice(0,4)
    barCode = barCode + ('0000' + brand).slice(-4);
  }

  if (stockCode == '' ){} else {separator = '-'}
  if (!vender) {stockCode = stockCode + separator +  '******'} else { stockCode = stockCode + separator + ('********' + vender.vender_code).slice(-8)}

 
  
  
  if (stockCode == '' ){} else {separator = '-'}
  if (color == '') {stockCode = stockCode + separator +  '****'} else { stockCode = stockCode + separator + ('****' + color).slice(-4)}

  if (stockCode == '' ){} else {separator = '-'}
  if (design_code == '') {stockCode = stockCode + separator +  '****'} else { stockCode = stockCode + separator + ('****' + design_code).slice(-4)}

 
  // var stockCode = 
  //                 stock_received_date?   stock_received_date : '' +
  //                 item.item_code !=''?   '-' + item.item_code : '' +
  //                 vender.vender_code !=''?   '-' + vender.vender_code : '' +
  //                 this.dataForm.value.brand !=''?   '-' + this.dataForm.value.brand : '' +
  //                 this.dataForm.value.color !=''?    '-' + this.dataForm.value.color : '' +
  //                 this.dataForm.value.design_code !=''?   '-' + this.dataForm.value.design_code : '' 
  //                 ;

  finalData = {stockCode : stockCode , barCode : barCode};
  return finalData;
}


}
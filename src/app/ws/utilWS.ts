import { Component, Injectable } from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LovComponent} from '../lov/lov.component'

//https://alligator.io/js/introduction-localstorage-sessionstorage/

@Injectable()
export class utilWS {
  constructor(
    public dialog: MatDialog
  ) { }

  lov_selected_values: any = []

 setLovDate(data:any)
 {
   this.lov_selected_values = data;
 } 

 getLovDate()
 {
   return this.lov_selected_values;
 }

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
    this.lov_selected_values = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = { type : lov_type , lovNature: lov_nature};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
   
    const dialogRef = this.dialog.open(LovComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        if (result = 'S') {callback(this.lov_selected_values)}
        else {callback([])}
  });
}


}
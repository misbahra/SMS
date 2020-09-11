import { Component, Injectable } from '@angular/core';


//https://alligator.io/js/introduction-localstorage-sessionstorage/

@Injectable()
export class utilWS {
  constructor() { }

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

}
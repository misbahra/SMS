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

}
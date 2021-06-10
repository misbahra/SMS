import { Component, OnInit , Inject} from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import {luWS} from '../ws/luWS';
  import * as stockWS from '../ws/stockWS';
  import { Router } from "@angular/router";
  import * as wsrSessionService from '../ws/sessionWS';
  import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
  import { utilWS } from '../ws/utilWS';
  import { vendersWS } from '../ws/vendersWS';
  import { ItemsWS } from '../ws/itemsWS';
  import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-batch-processes',
  templateUrl: './batch-processes.component.html',
  styleUrls: ['./batch-processes.component.css']
})
export class BatchProcessesComponent implements OnInit {

  dataForm: FormGroup;
    
    isBusy = false;
    
    isDisabled = false;
    response: any = [];
    
    stockdataList: any = [];
    stockUID = "";
    itemUID = "";
    todayDate = new Date().toISOString().slice(0, 16);
    vendersDataList : any = [];
    itemsDataList : any = [];
    stuffDataList : any = [];
    brandDataList : any = [];
    colorDataList : any = [];
    designDataList : any = [];
    stockDataList : any = [];
    barCode = '';
    percent : any = 0;
  
    messagetext = '';
   
    constructor(private webService: stockWS.stockWS,
      private sessionService: wsrSessionService.sessionService,
      private router: Router,
      private fb: FormBuilder,
      private utilService : utilWS,
      private vendersService : vendersWS,
     
      private itemsService : ItemsWS,
      private luService: luWS,
      public datepipe: DatePipe
    ) { }
  
    ngOnInit() {
           
      //load vender for list population
      this.loadVenders();
      this.loadItems();
      this.loadAllLUD('STST');
      this.loadAllLUD('BRND');
      this.loadAllLUD('COLR');
      this.loadAllLUD('DESC');
      
     
    }
  
    async loadAllLUD(id: any) {
      //alert("loading lud comp");  
      var luhData = [{value:id}]
      let response = await this.luService.getLUD(luhData);
      if (id=='STST'){this.stuffDataList = response;}
      if (id=='BRND'){this.brandDataList = response;}
      if (id=='COLR'){this.colorDataList = response;}
      if (id=='DESC'){this.designDataList = response;}
      
      
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };

    // select the stock based on 
  async selectStock() {
    this.isBusy = true
    
    let response = await this.webService.getStock();
    this.stockDataList = response;
    this.isBusy = false;
    

    };
   
    async loadVenders()
    {
      var response;
    response = await this.vendersService.getVenders();
    this.vendersDataList = response;
    //alert("Venders loaded - " + this.vendersDataList.length);
    }
  
    async loadItems()
    {
      var response;
    response = await this.itemsService.getItems();
    this.itemsDataList = response;
    //alert("Venders loaded - " + this.vendersDataList.length);
    }
  
   
  
    async setStockCode(){
      
      var data: any = {};
      await this.selectStock();
      var i = 0;
      var totalRecords = this.stockDataList.length;  
      this.stockDataList.forEach(element => {
       
        i +=1; 
        this.percent= ((i/totalRecords)*100);
       

        element.modified_on = Date.now();
        
        if (element.stuff == '' || element.stuff == 'MIX' || !element.stuff){element.stuff = 'C'} 
        if (element.brand == '' || !element.brand){element.brand = 'FB'}
        if (element.color == '' || !element.color){element.color = 'MIX'}
        if (element.design_code == '' || !element.design_code){element.design_code = 'STR'}

        data = this.utilService.setStockCode(
        this.itemsDataList,
        this.vendersDataList,
        element.stock_received_on,
        element.stock_uid,
        element.item_uid,
        element.vender_uid,
        element.stuff,
        element.brand,
        element.color,
        element.design_code
      );

      element.stock_code = data.stockCode; 
      // set bar code also 
      element.stock_bar_code = data.barCode;
     
       

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.webService.updateStock(element).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data updated' + response);

        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })
    
       
        //setTimeout(() => {  i +=1; this.percent= ((i/totalRecords)*100); }, 3000);
       
      });
      
      // data = this.utilService.setStockCode(
      //   this.itemsDataList,
      //   this.vendersDataList,
      //   this.dataForm.value.stock_received_on,
      //   this.dataForm.value.stock_uid,
      //   this.dataForm.value.item_uid,
      //   this.dataForm.value.vender_uid,
      //   this.dataForm.value.stuff,
      //   this.dataForm.value.brand,
      //   this.dataForm.value.color,
      //   this.dataForm.value.design_code
      // );
  
  
  }



}

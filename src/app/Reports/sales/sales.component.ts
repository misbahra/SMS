import { Component, OnInit } from '@angular/core';
import { ordersWS } from '../../ws/ordersWS';
import { Router } from "@angular/router";
import { sessionService } from '../../ws/sessionWS';
import { LudNewComponent } from '../../lu/lud-new/lud-new.component';
import * as momentNs from 'moment';
const moment = momentNs;
import { stockWS } from '../../ws/stockWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { customersWS } from '../../ws/customersWS';
import {luWS} from '../../ws/luWS';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

   
    constructor(
      private webService: ordersWS,
      private router: Router,
      private sessionService: sessionService,
      public stockService: stockWS,
      private fb: FormBuilder,
      private CustomersService: customersWS,
      private luService : luWS,
    ) {
  
    }
    model: any = [];
    ordersdataList: any = [];
    
    isBusy = false;
    isBusy2 = false;
    isBusy3 = false;
    isEdit = false;
    resp: any[];
    selectedID: any = "No Selected";
    selectedCode: any = [];
    isluhCodeSelected: boolean = false;
    yearList: any = [];
    monthList: any = [];
    columnDefs = [];
    rowData:any = [];
    customerList: any = [];
    orderForm: FormGroup;
     rowDataClicked:any = {};
      userPrivs = {"viewAllowed":"N",
                  "editAllowed":"N",
                  "deleteAllowed":"N",
                  "createAllowed":"N"};
     
      style = {
      marginTop: '0px',
      padding:'0px',
      width: '100%',
      height: '100%',
      //flex: '1 1 auto'
  };
  // for lud grid
  columnDefs2 = [];
  rowData2:any = [];

  columnDefs3 = [];
  rowData3:any = [];

   rowDataClicked2:any = {};
     
    style2 = {
    marginTop: '5px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
  };
  
  ngOnInit() {
    this.loadAllCustomers();
    this.loadAllLUD(10);
    this.loadAllLUD(11);
   
      //this.loadAllOrders();
      this.userPrivs = this.sessionService.getUsersPrivs('USR');
     
      //this.orderForm = new this.fb.group();
       this.orderForm = this.fb.group({
        customer_uid: ['', []],
        year: ['', []],
        month: ['',[]],
      }
        // , { validator: this.CheckUserName('UserName') }
      );
    };

    async loadAllLUD(id: any) {
      //alert("loading lud comp");  
      var luhData = [{value:id}]
      let response = await this.luService.getLUD(luhData);
      if (id=='10'){this.yearList = response;}
      if (id=='11'){
        var months: any = response;
        months.forEach(element => {
          this.monthList.push({lud_code : element.lud_code.padStart(2, "0"),
                                lud_desc : element.lud_desc});
         
        });
      }
     
     
      
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };
  
    clearFilters()
    {
      this.orderForm.reset();
    }
  
    async loadAllCustomers() {
      //alert("loading lud comp");  
      
      let response = await this.CustomersService.getCustomers();
      this.customerList = response;
  
      
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };
  
  
    async loadAllOrders() {
      //alert("loading orederes");
      this.isBusy = true;
      //alert("Selected Date is - " + this.orderForm.value.order_date);
     
      var year;
      var customerUID;
      var month;
     
      if (    this.orderForm.value.year == "" 
          ||  this.orderForm.value.year == null)
       { year = "-1"} 
        else {year = this.orderForm.value.year;};
  
        if (    this.orderForm.value.customer_uid == "" 
        ||  this.orderForm.value.customer_uid == null)
     { customerUID = "-1"} 
      else {
        //alert("customerUID = " + this.orderForm.value.customer_uid ); 
        customerUID = this.orderForm.value.customer_uid;};
  
      if (    this.orderForm.value.month == "" 
          ||  this.orderForm.value.month == null)
       { month = "-1"} 
        else {month = this.orderForm.value.month;};
      

       
      var parameters = [{"year":year ,
                        "month" : month,
                         "customer_uid" : customerUID}];
                       
      let response = await this.webService.getSummarySales(parameters);
      this.ordersdataList = response;
      
      this.columnDefs = [
        {
          headerName: '',
           width: 35,
           sortable: false,
           filter: false,
          checkboxSelection: true
          },
        {headerName: 'Year', field: '_id.year', width: 100, sortable: true, filter:true },
        {headerName: 'Month', field: '_id.month', width: 120, sortable: true, filter:true },
        {headerName: 'Sales', field: 'order_amount', width: 120, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"green"}
        , valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
        {headerName: 'Quantity', field: 'order_quantity', width: 150, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"red"},
        valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
        {headerName: 'Commission', field: 'order_amount', width: 150, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"blue"},
        valueFormatter: function(params) {
          var comm = params.value * .01;
          var num =   Math.floor(comm)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },

      {headerName: 'Comm', field: 'comm', width: 150, sortable: true, filter:true ,
      cellStyle: {textAlign: "right",color:"blue"},
      valueFormatter: function(params) {
          var num =   Math.floor(params.value)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (num == "0" ){return null;}
        else {return num;}
        
      },
    },

    {headerName: 'Cost', field: 'cost_price', width: 150, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"blue"},
    valueFormatter: function(params) {
     
      var num =   Math.floor(params.value)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      if (num == "0" ){return null;}
      else {return num;}
      
    },
  },

  {headerName: 'Profit', field: 'profit_amount', width: 150, sortable: true, filter:true ,
  cellStyle: {textAlign: "right",color:"blue"},
  valueFormatter: function(params) {
   
    var num =   Math.floor(params.value)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if (num == "0" ){return null;}
    else {return num;}
    
  },
},
      ];
      this.rowData = response;
     
  
      //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
      //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
      this.isBusy = false;
    };

    // load sales details

    async loadDayWiseSales() {
      //alert("loading orederes");
      this.isBusy2 = true;
      this.rowData2 = [];
     
      var year;
      var customerUID;
      var month;
     
      if (    this.rowDataClicked._id.year == "" 
          ||  this.rowDataClicked._id.year == null)
       { year = "-1"} 
        else {year = this.rowDataClicked._id.year;};
  
        if (    this.orderForm.value.customer_uid == "" 
        ||  this.orderForm.value.customer_uid == null)
     { customerUID = "-1"} 
      else {
        //alert("customerUID = " + this.orderForm.value.customer_uid ); 
        customerUID = this.orderForm.value.customer_uid;};
  
      if (    this.rowDataClicked._id.month == "" 
          ||  this.rowDataClicked._id.month == null)
       { month = "-1"} 
        else {month = this.rowDataClicked._id.month;};
      

       
      var parameters = [{"year":year ,
                        "month" : month,
                         "customer_uid" : customerUID}];
                       
      var response = await this.webService.getSummarySalesByDay(parameters);
      
    
      this.columnDefs2 = [
        // {
        //   headerName: '',
        //    width: 35,
        //    sortable: false,
        //    filter: false,
        //   checkboxSelection: true
        //   },
       // {headerName: 'Year', field: '_id.year', width: 90, sortable: true, filter:true },
       // {headerName: 'Month', field: '_id.month', width: 90, sortable: true, filter:true },
        {headerName: 'Day', field: '_id.day', width: 90, sortable: true, filter:true },
        {headerName: 'Sales', field: 'order_amount', width: 100, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"green"}
        , valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
        {headerName: 'Qty', field: 'order_quantity', width: 100, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"red"},
        valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
      {headerName: 'Cost', field: 'cost_price', width: 100, sortable: true, filter:true ,
      cellStyle: {textAlign: "right",color:"blue"},
      valueFormatter: function(params) {
       
        var num =   Math.floor(params.value)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (num == "0" ){return null;}
        else {return num;}
        
      },
    },
  
    {headerName: 'Pft', field: 'profit_amount', width: 100, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"blue"},
    valueFormatter: function(params) {
     
      var num =   Math.floor(params.value)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      if (num == "0" ){return null;}
      else {return num;}
      
    },
  }, 
      ];
      this.rowData2 = response;
     
  
      //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
      //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
      this.isBusy2 = false;
    };


    async loadItemWiseSales() {
      //alert("loading item wise data");
      this.isBusy3 = true;
      this.rowData3 = [];
     
      var year;
      var customerUID;
      var month;
     
      if (    this.rowDataClicked._id.year == "" 
          ||  this.rowDataClicked._id.year == null)
       { year = "-1"} 
        else {year = this.rowDataClicked._id.year;};
  
        if (    this.orderForm.value.customer_uid == "" 
        ||  this.orderForm.value.customer_uid == null)
     { customerUID = "-1"} 
      else {
        //alert("customerUID = " + this.orderForm.value.customer_uid ); 
        customerUID = this.orderForm.value.customer_uid;};
  
      if (    this.rowDataClicked._id.month == "" 
          ||  this.rowDataClicked._id.month == null)
       { month = "-1"} 
        else {month = this.rowDataClicked._id.month;};
      

       
      var parameters = [{"year":year ,
                        "month" : month,
                         "customer_uid" : customerUID}];
                       
      var response = await this.webService.getSummarySalesByItem(parameters);
      
      
      
      this.columnDefs3 = [
        // {
        //   headerName: '',
        //    width: 35,
        //    sortable: false,
        //    filter: false,
        //   checkboxSelection: true
        //   },
       // {headerName: 'Year', field: '_id.year', width: 90, sortable: true, filter:true },
        //{headerName: 'Month', field: '_id.month', width: 90, sortable: true, filter:true },
        {headerName: 'Item', field: '_id.item_name', width: 250, sortable: true, filter:true },
        {headerName: 'Sales', field: 'order_amount', width: 90, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"green"}
        , valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
        {headerName: 'Qty', field: 'order_quantity', width: 90, sortable: true, filter:true ,
        cellStyle: {textAlign: "right",color:"red"},
        valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
      {headerName: 'Cost', field: 'cost_price', width: 100, sortable: true, filter:true ,
      cellStyle: {textAlign: "right",color:"blue"},
      valueFormatter: function(params) {
       
        var num =   Math.floor(params.value)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (num == "0" ){return null;}
        else {return num;}
        
      },
    },
  
    {headerName: 'Pft', field: 'profit_amount', width: 100, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"blue"},
    valueFormatter: function(params) {
     
      var num =   Math.floor(params.value)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      if (num == "0" ){return null;}
      else {return num;}
      
    },
  },
      ];
      this.rowData3 = response;
     
  
      //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
      //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
      this.isBusy3 = false;
    };


  
    // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }

  async onRowSelected(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked = e.node.data;
    
    //alert(JSON.stringify(e.node.data));
    this.loadDayWiseSales();
    this.loadItemWiseSales();
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked.year == e.node.data.year && this.rowDataClicked.month == e.node.data.month ){
      this.rowDataClicked = {};
      
      this.loadDayWiseSales();
      this.loadItemWiseSales();
     
  }
 } 
}
 
}

  
  }
  
  
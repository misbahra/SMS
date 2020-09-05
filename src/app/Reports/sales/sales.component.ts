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
    ) {
  
    }
    model: any = [];
    ordersdataList: any = [];
    orderItemsdataList: any = [];
    isBusy = false;
    isLUDBusy = false;
    isEdit = false;
    resp: any[];
    selectedID: any = "No Selected";
    selectedCode: any = [];
    isluhCodeSelected: boolean = false;
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
      flex: '1 1 auto'
  };
  // for lud grid
  columnDefs2 = [];
  rowData2:any = [];
   rowDataClicked2:any = {};
     
    style2 = {
    marginTop: '5px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
  };
  
  ngOnInit() {

   
  
    this.loadAllCustomers();
   
      //this.loadAllOrders();
      this.userPrivs = this.sessionService.getUsersPrivs();
     
      //this.orderForm = new this.fb.group();
       this.orderForm = this.fb.group({
        order_uid: ['', []],
        customer_uid: ['', []],
        order_date: ['', []],
        invoice_number: ['',[]],
      }
        // , { validator: this.CheckUserName('UserName') }
      );
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
     
      var orderDate;
      var customerUID;
      var invoiceNumber;
     
      if (    this.orderForm.value.order_date == "" 
          ||  this.orderForm.value.order_date == null)
       { orderDate = "-1"} 
        else {orderDate = this.orderForm.value.order_date;};
  
        if (    this.orderForm.value.customer_uid == "" 
        ||  this.orderForm.value.customer_uid == null)
     { customerUID = "-1"} 
      else {alert("customerUID = " + this.orderForm.value.customer_uid ); customerUID = this.orderForm.value.customer_uid;};
  
      if (    this.orderForm.value.invoice_number == "" 
          ||  this.orderForm.value.invoice_number == null)
       { invoiceNumber = "-1"} 
        else {invoiceNumber = this.orderForm.value.invoice_number;};
      

       
      var parameters = [{"year":2020 ,
                        "month" : 7,
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
        {headerName: 'Year', field: '_id.year', width: 150, sortable: true, filter:true },
        {headerName: 'Month', field: '_id.month', width: 300, sortable: true, filter:true },
        {headerName: 'amount', field: 'order_amount', width: 300, sortable: true, filter:true },
        
      ];
      this.rowData = response;
     
  
      //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
      //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
      this.isBusy = false;
    };
  
    // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }
  
  }
  
  
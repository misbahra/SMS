import { Component, OnInit } from '@angular/core';
import { ordersWS } from '../ws/ordersWS';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LuhNewComponent } from '../lu/luh-new/luh-new.component';
import { LudNewComponent } from '../lu/lud-new/lud-new.component';
//import moment from 'moment';
//const moment = momentNs;
var moment = require('moment');
import { stockWS } from '../ws/stockWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { customersWS } from '../ws/customersWS';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(
    private webService: ordersWS,
    private router: Router,
    private sessionService: sessionService,
    public dialog: MatDialog,
    public stockService: stockWS,
    private fb: FormBuilder,
    private CustomersService: customersWS,
  ) {

  }
  model: any = [];
  ordersdataList: any = [];
  orderItemsdataList: any = [];
  isBusy = false;
  isDetailsBusy = false;
  isEdit = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  columnDefs = [];
  rowData:any = [];
  customerList: any = [];
  queryParams : any = [];
  orderForm: FormGroup;
  sumAmount: any = 0;
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
defaultColDef = {
  //flex: 1,
  cellClass: 'number-cell',
  resizable: true,
  sortable: true, 
  filter:true
};

ngOnInit() {

  this.loadAllCustomers();
    //this.loadAllOrders();
    this.userPrivs = this.sessionService.getUsersPrivs();
    if (this.selectedCode.length > 0){this.loadAllOrderItems(this.selectedCode);}
    //this.orderForm = new this.fb.group();
     this.orderForm = this.fb.group({
      order_uid: ['', []],
      customer_uid: ['', []],
      order_date: [new Date().toISOString().slice(0, 10) , []],
      invoice_number: ['',[]],
    }
      // , { validator: this.CheckUserName('UserName') }
    );

     // set ther order date if its called from new order

     this.queryParams = this.sessionService.getParameters();
     if (this.queryParams.length > 0)
     {
       this.orderForm.controls.order_date.setValue(new Date(this.queryParams[0].order_date).toISOString().slice(0, 10));
       this.sessionService.deleteParameters();
      };
    

    this.loadAllOrders();
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
    this.sumAmount = 0;
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
    

    var parameters = [{"order_date":orderDate ,
                       "customer_uid" : customerUID,
                      "invoice_number" : invoiceNumber }];
    //let response = await this.webService.getOrders(parameters);
    
    let response = await this.webService.getSummaryByOrder(parameters);
    this.ordersdataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },
      {headerName: '#', field: '_id.order_uid' , width: 200, sortable: true, filter:true  },
      {headerName: 'Date', field: '_id.order_date', width: 200, sortable: true, filter:true 
      ,valueFormatter: function (params) {
        return moment(params.value.substr(0,16)).format('DD-MMM-YYYY HH:mm');
        //return params.value.substr(0,16);
      }
    },
      {headerName: 'Invoice#', field: '_id.invoice_number', width: 150, sortable: true, filter:true },
      {headerName: 'Customer', field: '_id.customer_name', width: 300, sortable: true, filter:true },
      {headerName: 'Amount', field: 'order_amount', width: 130, sortable: true, filter:true , cellStyle: {textAlign: "right",color:"green"},
       valueFormatter: function(params) {
       return params.value.toFixed(2)
      },
    },
      {headerName: 'Status', field: '_id.status', width: 100, sortable: true, filter:true },
      {headerName: 'HD', field: '_id.home_delivery', width: 100, sortable: true, filter:true },
      {headerName: 'PM', field: '_id.payment_mode', width: 100, sortable: true, filter:true },
          
    ];
    this.rowData = response;
    this.ordersdataList.forEach(element => {
      this.sumAmount +=element.order_amount;
    });

    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };

  async loadAllOrderItems(id: any) {
    //alert("loading lud comp");  
    this.isDetailsBusy = true;
    //setTimeout(null,4000);
    //alert("luh value is " + id[0].value);
   let response = await this.webService.getAllItemsForOrder(id);
   this.orderItemsdataList = response;
   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
    //{headerName: 'order#', field: 'order_uid' , width: 200, sortable: true, filter:true },
    {headerName: 'Item', field: 'item_name', width: 300, sortable: true, filter:true },
    {headerName: 'Quantity', field: 'quantity', width: 130, sortable: true, filter:true ,
    cellStyle: {textAlign: "right"},
    valueFormatter: function(params) {
      return params.value.toFixed(2)
     },
   },
    {headerName: 'Rate', field: 'unit_sale_price', width: 130, sortable: true, filter:true ,
    cellStyle: {textAlign: "right"},
    valueFormatter: function(params) {
      return params.value.toFixed(2)
     },
   },
    {headerName: 'Total price', field: 'total_price', width: 130, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"green"}
        ,  valueFormatter: function(params) {
          return params.value.toFixed(2)
         },
       },
    {headerName: 'Net price', field: 'total_price_with_taxes', width: 130, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"blue"}
        ,  valueFormatter: function(params) {
          return params.value.toFixed(2)
         },
       },
    {headerName: 'Stock uid', field: 'stock_uid', width: 200, sortable: true, filter:true },
    {headerName: 'Posted', field: 'posted_to_stock', width: 130, sortable: true, filter:true },
    {headerName: 'cp', field: 'unit_cost_price', width: 130, sortable: true, filter:true ,
    cellStyle: {textAlign: "right",color:"blue"}
        ,   valueFormatter: function(params) {
         
          return params.value.toFixed(2)
         },
       },
    
  ];
  this.rowData2 = response;

    //alert("Data is :" + this.LUDdataList[0].lud_desc);
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    //this.ScrolToTop();
    this.isDetailsBusy = false;
   
  };

  LoadOrderItems(code: any) {
    this.selectedID = this.rowDataClicked._id.order_uid;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "order_uid", "value": this.rowDataClicked._id.order_uid });
    this.loadAllOrderItems(this.selectedCode);
  }

  deleteOrder() {
   //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record? All its items will also be deleted. ')) {
           this.webService.deleteOrder(this.rowDataClicked._id).subscribe(
      (response) => {
        this.decreaseStockSold(this.orderItemsdataList);
        this.loadAllOrders();
        this.rowData2 = [];

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked.luh_code + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}

decreaseStockSold(data : any)
{

  this.stockService.decreaseSoldStock(data).subscribe(
    (response) => {
      },
    (error) => {
      //Handle the error here
      //If not handled, then throw it
      console.error(error);
      
   });

}

postAllOrders()
{

  this.webService.postAllOrderItemsToStock([]).subscribe(
    (response) => {
      },
    (error) => {
      //Handle the error here
      //If not handled, then throw it
      console.error(error);
      
   });

}



  createOrder(id: any) {
    this.sessionService.deleteParameters();
    this.sessionService.setParameters([{ operation: 1 , order_date : this.orderForm.value.order_date }]);
    this.router.navigate(['/neworder'], {skipLocationChange: true});
}


editOrder() {
  if (this.rowDataClicked._id == "" || this.rowDataClicked._id == null ) {alert("Please select an order first.");}
  else
  {
    this.sessionService.deleteParameters();
  this.sessionService.setParameters([{ operation: 2, order_date : this.orderForm.value.order_date, order_id: this.rowDataClicked._id.order_uid }]);
  this.router.navigate(['/neworder'], {skipLocationChange: true});
  }
}

  // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }

 

// // open the new / update form
openLudDialog(id: any) {
  //alert("test 1")
  // delete the parameters array
  if (this.rowDataClicked2._id  || id == null) {
  this.sessionService.deleteParameters();
  // check if any parameter is sent or not
  //if sent then this will be opened for update
  if (id != null) {
    //alert("test 2")
    this.sessionService.setParameters([{ name: "lud_id", value: this.rowDataClicked2._id }]);
  }
  else
  {
 //alert("test 2-" + this.selectedID);  
  this.sessionService.setParameters([{ name: "luh_code", value: this.rowDataClicked.luh_code }]);
  }

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  const dialogRef = this.dialog.open(LudNewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if (result == "save") {
      this.LoadOrderItems(this.selectedID);
      this.rowDataClicked2 = {};
    }
    return (result);
  });
}
else
{ alert('Please select a record to update.');}
}

ScrolToTop() {
  let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
}



onRowSelected(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked = e.node.data;
    this.rowDataClicked2 = {};
    this.LoadOrderItems(1);
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked._id == e.node.data._id ){
      this.rowDataClicked = {};
      this.rowDataClicked2 = {};
      this.LoadOrderItems(1);
     
  }
 }
}
 
}

onRowSelected2(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked2 = e.node.data;
 
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked2){
      if (this.rowDataClicked2._id == e.node.data._id ){
      this.rowDataClicked2 = {};
     
  }
 }
}
 
}

}

